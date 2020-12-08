<p align="center">
	<img src="static/money-printer-chad.png" height="400px"/>
</p>

# Ditto Money

Smart contracts for the Ditto elastic supply token. In Ditto money, the total token supply is not fixed, but instead adjusts on a regular basis. These supply adjustments, called "rebases",  are done in such a way that users’ proportional holdings don’t change and thus aren’t diluted. Rebases are performed to achieve a specific target price, with the idea being that a token’s nominal price will steadily be moved over time toward its target. In the case of Ditto money the price target is simply $1.

## Architecture

The Ditto project is a fork of [Ampleforth](https://www.ampleforth.org/). It includes code from other cutting-edge elastic supply projects and several novel ideas. The original architecture has been simplified into two main contracts:

1. [DittoToken](Ditto.sol) - ERC20 token that implements the rebase function.
2. [DittoMaster](Master.sol) - Contains the rebase configuration and admin functionality.

The third necessary component is the price Oracle. The [MarketOracle](MarketOracle.sol) smart contract provides the functionality for calculating an average price using the Uniswap TWAP Oracle interface.

## Configuration

Important rebase parameters are found in the master contract. Most of these values are set during construction or directly in the code.

- `deviationThreshold`:  If the current exchange rate is within this fractional distance from the target price, no supply update is performed. By default this is set to 0.05.
- `rebaseCooldown:` Minimum time that must pass between rebases, in seconds. The default value is 7,200.

### Notifying pools of supply changes

Most of the time, liquidity and lending pools need to be notified of rebases so that the internal accounting is updated accordingly. This needs to happen atomically in the same transaction as the rebase. If this is not done correctly, attackers can take advantage of the internal accounting mismatch to steal value from liquidity providers.

The Master contract maintains a list of external function calls that are executed at the end of every rebase. The appropriate calls must be added by the contract owner whenever a new Ditto liquidity pool is created (e.g., call `sync()` in an Uniswap liquidity pool). Use `addTransaction(address destination, bytes calldata data)` to add a call to the list.

### Intial distribution lock

Transferring DittoTokens is initially restricted to the owner. This is to allow an orderly distribution via airdrops, token sale, etc., while preventing users from listing Ditto on AMMs ahead of the Ditto team. Once the distribution lock has been released bu the contract creator it cannot be re-engaged.

## Ditto on the BSC Testnet
