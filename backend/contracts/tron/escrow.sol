// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Escrow {
    address public tokenAddress;
    address public owner;
    address private commissionWallet;
    address public buyer;
    address public seller;

    uint256 private minimumEscrowAmount;
    uint256 private commissionRate;
    uint256 private depositTime;

    enum State {
        INIT,
        FUNDED,
        ACCEPTED,
        RELEASED,
        REFUNDED,
        WITHDRAWN_BY_OWNER
    }

    State private currentState;

    event Funded(
        address buyer,
        address escrowWallet,
        uint256 totalEscrowAmount
    );
    event Accepted(address escrowWallet, address seller);
    event ReleaseFund(
        address released_by,
        address escrowWallet,
        uint256 amount_released,
        uint256 commission_amount
    );
    event Withdraw(
        address _buyer,
        address escrowWallet,
        uint256 amount_withdrawn,
        uint256 commission_amount
    );
    event SixMonths(
        address _destAddr,
        address escrowWallet,
        uint256 amount_withdrawn
    );

    modifier buyerOnly(address addr) {
        require(addr == buyer, "Escrow: Only accessible by buyer!");
        _;
    }

    modifier notOwner() {
        require(msg.sender != owner, "Escrow: Not accessible by owner!");
        _;
    }

    modifier notCommissionWallet(address addr) {
        require(
            addr != commissionWallet,
            "Escrow: Can not be commission wallet!"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Escrow: Only accessible by owner!");
        _;
    }

    modifier onlyBuyerOrSeller() {
        require(
            msg.sender == buyer || msg.sender == seller,
            "Escrow: Only accessible by buyer or seller!"
        );
        _;
    }

    modifier initCheck() {
        require(
            owner == address(0x0),
            "Escrow: Deal has already been initialized!"
        );
        _;
    }

    modifier stateLessThanAccepted() {
        require(
            currentState < State.ACCEPTED,
            "Escrow: Deal can not be funded once accepted!"
        );
        _;
    }

    modifier stateFunded() {
        require(
            currentState == State.FUNDED,
            "Escrow: Deal is not at the FUNDED state!"
        );
        _;
    }

    modifier stateAccepted() {
        require(
            currentState == State.ACCEPTED,
            "Escrow: Deal is not at the ACCEPTED state!"
        );
        _;
    }

    modifier minimumAmount(uint256 amount) {
        require(
            amount >= minimumEscrowAmount,
            "Escrow: Deposit value less than minimum amount required!"
        );
        _;
    }

    modifier distinctAddresses(address _addr1, address _addr2) {
        require(_addr1 != _addr2, "Escrow: Addresses can not be the same!");
        _;
    }

    modifier minimumTimePeriod() {
        require(
            block.timestamp - depositTime > 26 weeks,
            "Funds can be withdrawn only after a period of 6 months!"
        );
        _;
    }

    modifier checkAllowance(uint256 amount) {
        require(
            amount <= ERC20(tokenAddress).allowance(msg.sender, address(this)),
            "Escrow: Check Allowance!"
        );
        _;
    }

    function initialize(
        address token,
        address _commissionWallet,
        uint256 _minimumEscrowAmount,
        uint256 _commissionRate,
        address _owner,
        address _buyer
    )
        public
        initCheck
        distinctAddresses(_buyer, owner)
        notCommissionWallet(_owner)
        notCommissionWallet(_buyer)
    {
        tokenAddress = token;
        commissionWallet = _commissionWallet;
        minimumEscrowAmount = _minimumEscrowAmount;
        commissionRate = _commissionRate;
        owner = _owner;
        buyer = _buyer;
    }

    function deposit(
        address _buyer,
        uint256 _amount
    )
        public
        stateLessThanAccepted
        buyerOnly(_buyer)
        minimumAmount(_amount)
        checkAllowance(_amount)
    {
        ERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        if (currentState == State.INIT) {
            currentState = State.FUNDED;
            depositTime = block.timestamp;
        }
        emit Funded(
            _buyer,
            address(this),
            ERC20(tokenAddress).balanceOf(address(this))
        );
    }

    function acceptDeal()
        public
        notOwner
        stateFunded
        distinctAddresses(buyer, msg.sender)
        notCommissionWallet(msg.sender)
    {
        seller = msg.sender;
        currentState = State.ACCEPTED;
        emit Accepted(address(this), seller);
    }

    function releaseFund() public stateAccepted onlyBuyerOrSeller {
        (
            uint256 amountAfterCommission,
            uint256 commissionAmount
        ) = calculateAmountToTransfer();
        msg.sender == buyer
            ? ERC20(tokenAddress).transfer(seller, amountAfterCommission)
            : ERC20(tokenAddress).transfer(buyer, amountAfterCommission);
        ERC20(tokenAddress).transfer(commissionWallet, commissionAmount);
        currentState = State.RELEASED;
        emit ReleaseFund(
            msg.sender,
            address(this),
            amountAfterCommission,
            commissionAmount
        );
    }

    function withdrawFund() public stateFunded buyerOnly(msg.sender) {
        (
            uint256 amountAfterCommission,
            uint256 commissionAmount
        ) = calculateAmountToTransfer();
        ERC20(tokenAddress).transfer(buyer, amountAfterCommission);
        ERC20(tokenAddress).transfer(commissionWallet, commissionAmount);
        currentState = State.REFUNDED;
        emit Withdraw(
            msg.sender,
            address(this),
            amountAfterCommission,
            commissionAmount
        );
    }

    function calculateAmountToTransfer()
        internal
        view
        returns (uint256, uint256)
    {
        uint256 dealAmount = ERC20(tokenAddress).balanceOf(address(this));
        uint256 amountAfterCommission = dealAmount -
            ((dealAmount * commissionRate) / 100);
        uint256 commissionAmount = dealAmount - amountAfterCommission;
        return (amountAfterCommission, commissionAmount);
    }

    function postSixMonths() public onlyOwner stateAccepted minimumTimePeriod {
        uint256 contractBalance = ERC20(tokenAddress).balanceOf(address(this));
        ERC20(tokenAddress).transfer(owner, contractBalance);
        currentState = State.WITHDRAWN_BY_OWNER;
        emit SixMonths(owner, address(this), contractBalance);
    }

    function currentStateOfDeal() public view returns (State) {
        return currentState;
    }

    function commissionRateOfDeal() public view returns (uint256) {
        return commissionRate;
    }
}
