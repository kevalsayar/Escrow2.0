// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./escrow.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EscrowFactory is OwnableUpgradeable {
    address private beacon;
    uint256 private commissionRate;
    address private commissionWallet;
    uint256 private minimumEscrowAmount;

    struct EscrowDetails {
        address escrowProxyAddress;
        address tokenAddress;
    }

    mapping(string => EscrowDetails) private dealIdToEscrowDetails;

    /**
     * @dev Emitted when a new proxy address for Escrow's deployed.
     */
    event NewProxyAddress(
        address NewProxyAddress,
        string dealId,
        uint256 commissionRate,
        uint256 minimumEscrowAmount,
        address commissionWallet
    );

    /**
     * @dev Throws if address passed is not a contract address.
     */
    modifier isContract(address _addr) {
        require(
            _addr.code.length != 0 && _addr != address(0),
            "Escrow Factory: Address has to be a contract!"
        );
        _;
    }

    /**
     * @dev Throws if address passed is not a wallet address.
     */
    modifier isAddressValid(address addr) {
        require(
            addr.code.length == 0 && addr != address(0x0),
            "Escrow Factory: Invalid address!"
        );
        _;
    }

    /**
     * @dev Throws if commission rate doesn't meet the requirements.
     */
    modifier dealCommissionRate(uint256 comm_rate) {
        require(
            comm_rate <= 100 && comm_rate > 0,
            "Escrow Factory: Invalid commission rate!"
        );
        _;
    }

    /**
     * @dev Throws if caller's the owner.
     */
    modifier notOwnerOrCommissionWallet() {
        require(
            msg.sender != owner() || msg.sender != commissionWallet,
            "Escrow Factory: Not accessible by owner or commission wallet!"
        );
        _;
    }

    modifier dealIdExistent(string memory _dealId) {
        require(
            dealIdToEscrowDetails[_dealId].escrowProxyAddress != address(0),
            "Escrow Factory: DealId Inexistent!"
        );
        _;
    }

    /**
     * @dev Throws if DealId's existent.
     */
    modifier dealIdInexistent(string memory _dealId) {
        require(
            dealIdToEscrowDetails[_dealId].escrowProxyAddress == address(0),
            "Escrow Factory: Repetition of DealId is unallowed!"
        );
        _;
    }

    modifier invalidMinEscrowAmount(uint256 amount) {
        require(amount > 0, "Escrow Factory: Minimum amount can not be zero!");
        _;
    }

    modifier checkAllowance(address tokenAddress, uint256 amount) {
        require(
            amount <= ERC20(tokenAddress).allowance(msg.sender, address(this)),
            "Escrow Factory: Check Allowance!"
        );
        _;
    }

    /**
     * @dev Sets the address of UpgradeableBeacon, and the contract's deployer as the
     * initial owner of the contract.
     */
    function initialize(
        address _beacon,
        uint256 _commissionRate,
        address _commissionWallet,
        uint256 _minimumEscrowAmount
    )
        public
        isContract(_beacon)
        isAddressValid(_commissionWallet)
        dealCommissionRate(_commissionRate)
        invalidMinEscrowAmount(_minimumEscrowAmount)
        initializer
    {
        __Ownable_init();
        beacon = _beacon;
        commissionRate = _commissionRate;
        commissionWallet = _commissionWallet;
        minimumEscrowAmount = _minimumEscrowAmount;
    }

    /**
     * @dev Creates a beacon proxy, sets user's details and deposits ether into
     * the beacon proxy.
     *
     * External function with access restriction.
     * Emits a {NewProxyAddress} event.
     */
    function createEscrowProxy(
        string memory _dealId,
        address token,
        uint256 amount
    )
        external
        dealIdInexistent(_dealId)
        notOwnerOrCommissionWallet
        isContract(token)
        checkAllowance(token, amount)
    {
        BeaconProxy proxy = new BeaconProxy(
            beacon,
            abi.encodeWithSelector(
                Escrow.initialize.selector,
                token,
                commissionWallet,
                minimumEscrowAmount,
                commissionRate,
                owner(),
                msg.sender
            )
        );
        emit NewProxyAddress(
            address(proxy),
            _dealId,
            commissionRate,
            minimumEscrowAmount,
            commissionWallet
        );
        setUserDealDetails(_dealId, address(proxy), token);
        depositFunds(_dealId, amount);
    }

    function depositFunds(
        string memory _dealId,
        uint256 amount
    ) public dealIdExistent(_dealId) notOwnerOrCommissionWallet {
        address proxy = dealIdToEscrowDetails[_dealId].escrowProxyAddress;
        address token = dealIdToEscrowDetails[_dealId].tokenAddress;
        require(
            amount <= ERC20(token).allowance(msg.sender, address(this)),
            "Escrow Factory: Check Allowance!"
        );
        ERC20(token).transferFrom(msg.sender, address(this), amount);
        ERC20(token).approve(proxy, amount);
        Escrow(proxy).deposit(msg.sender, amount);
    }

    /**
     * @dev Sets proxy contract address against the user's specific dealId.
     * Private function without access restriction.
     */
    function setUserDealDetails(
        string memory _dealId,
        address _escrowAddress,
        address _tokenAddress
    ) private {
        dealIdToEscrowDetails[_dealId].escrowProxyAddress = _escrowAddress;
        dealIdToEscrowDetails[_dealId].tokenAddress = _tokenAddress;
    }

    /**
     * @dev Updates the commission rate for future escrow beacon proxies.
     * Public function with access restriction.
     */
    function changeCommissionRate(
        uint256 _commissionRate
    ) public onlyOwner dealCommissionRate(_commissionRate) {
        commissionRate = _commissionRate;
    }

    /**
     * @dev Returns proxy address of a particular user's deal.
     */
    function escrowProxyAddress(
        string memory _dealId
    ) public view returns (address) {
        return dealIdToEscrowDetails[_dealId].escrowProxyAddress;
    }

    /**
     * @dev Returns implementation address for a particular beacon.
     */
    function escrowImplAddress() public view returns (address) {
        return UpgradeableBeacon(beacon).implementation();
    }

    /**
     * @dev Returns beacon address to which proxy address's point to.
     */
    function escrowBeaconAddress() public view returns (address) {
        return beacon;
    }

    function commissionRateOfDeal() public view returns (uint256) {
        return commissionRate;
    }

    function minEscrowAmount() public view returns (uint256) {
        return minimumEscrowAmount;
    }
}
