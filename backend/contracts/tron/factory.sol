// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./escrow.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EscrowFactory is OwnableUpgradeable {
    uint256 private commissionRate;
    address private commissionWallet;
    uint256 private minimumEscrowAmount;

    struct EscrowDetails {
        address escrowAddress;
        address tokenAddress;
    }

    mapping(string => EscrowDetails) private dealIdToEscrowDetails;

    /**
     * @dev Emitted when a new proxy address for Escrow's deployed.
     */
    event NewEscrow(
        address escrowAddress,
        string dealId,
        uint256 commissionRate,
        uint256 minimumEscrowAmount,
        address commissionWallet
    );
    
    event EscrowFunded( 
        string dealId,
        address buyer,
        address escrowWallet,
        uint256 totalEscrowAmount
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
            dealIdToEscrowDetails[_dealId].escrowAddress != address(0),
            "Escrow Factory: DealId Inexistent!"
        );
        _;
    }

    /**
     * @dev Throws if DealId's existent.
     */
    modifier dealIdInexistent(string memory _dealId) {
        require(
            dealIdToEscrowDetails[_dealId].escrowAddress == address(0),
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
     * @dev Sets the contract's deployer as the initial owner of the contract.
     */
    function initialize(
        uint256 _commissionRate,
        address _commissionWallet,
        uint256 _minimumEscrowAmount
    )
        public
        isAddressValid(_commissionWallet)
        dealCommissionRate(_commissionRate)
        invalidMinEscrowAmount(_minimumEscrowAmount)
        initializer
    {
        __Ownable_init();
        commissionRate = _commissionRate;
        commissionWallet = _commissionWallet;
        minimumEscrowAmount = _minimumEscrowAmount;
    }

    /**
     * @dev Creates a new escrow, sets user's details and deposits ether into it.
     *
     * External function with access restriction.
     * Emits a {NewEscrow} event.
     */
    function createEscrow(
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
        Escrow escrow = new Escrow();
        Escrow(escrow).initialize(token,commissionWallet, minimumEscrowAmount, commissionRate, owner(), (msg.sender) );
        emit NewEscrow(
            address(escrow),
            _dealId,
            commissionRate,
            minimumEscrowAmount,
            commissionWallet
        );
        setUserDealDetails(_dealId, address(escrow), token);
        depositFunds(_dealId, amount);
    }

    function depositFunds(
        string memory _dealId,
        uint256 amount
    ) public dealIdExistent(_dealId) notOwnerOrCommissionWallet {
        address escrow = dealIdToEscrowDetails[_dealId].escrowAddress;
        address token = dealIdToEscrowDetails[_dealId].tokenAddress;
        require(
            amount <= ERC20(token).allowance(msg.sender, address(this)),
            "Escrow Factory: Check Allowance!"
        );
        ERC20(token).transferFrom(msg.sender, address(this), amount);
        ERC20(token).approve(escrow, amount);
        Escrow(escrow).deposit(msg.sender, amount);
        emit EscrowFunded(_dealId, msg.sender, escrow, amount);
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
        dealIdToEscrowDetails[_dealId].escrowAddress = _escrowAddress;
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
    function escrowAddress(
        string memory _dealId
    ) public view returns (address) {
        return dealIdToEscrowDetails[_dealId].escrowAddress;
    }

    function commissionRateOfDeal() public view returns (uint256) {
        return commissionRate;
    }

    function minEscrowAmount() public view returns (uint256) {
        return minimumEscrowAmount;
    }
}
