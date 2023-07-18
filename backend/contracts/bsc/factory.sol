// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./escrow.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract EscrowFactory is OwnableUpgradeable {
    address private beacon;
    uint256 private commissionRate;
    address private commissionWallet;
    uint256 private minimumEscrowAmount;

    mapping(string => address) private dealIdToEscrowProxy;

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
            "Beacon address has to be a contract address!"
        );
        _;
    }

    /**
     * @dev Throws if commission rate doesn't meet the requirements.
     */
    modifier dealCommissionRate(uint256 comm_rate) {
        require(comm_rate <= 100 && comm_rate > 0, "Invalid commission rate!");
        _;
    }

    /**
     * @dev Throws if caller's the owner.
     */
    modifier notOwnerOrCommissionWallet() {
        require(
            msg.sender != owner() || msg.sender != commissionWallet,
            "Escrow: Not accessible by owner or commission wallet!"
        );
        _;
    }

    /**
     * @dev Throws if DealId's existent.
     */
    modifier dealIdInexistent(string memory _dealId) {
        require(
            dealIdToEscrowProxy[_dealId] == address(0),
            "Escrow: Repetition of DealId is unallowed!"
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
    ) public isContract(_beacon) initializer {
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
        string memory _dealId
    ) external payable dealIdInexistent(_dealId) notOwnerOrCommissionWallet {
        BeaconProxy proxy = new BeaconProxy(
            beacon,
            abi.encodeWithSelector(
                Escrow.initialize.selector,
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
        setUserDealDetails(_dealId, address(proxy));
        Escrow(address(proxy)).deposit{value: msg.value}(msg.sender);
    }

    /**
     * @dev Sets proxy contract address against the user's specific dealId.
     * Private function without access restriction.
     */
    function setUserDealDetails(
        string memory _dealId,
        address _escrowAddress
    ) private {
        dealIdToEscrowProxy[_dealId] = _escrowAddress;
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
        return dealIdToEscrowProxy[_dealId];
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
