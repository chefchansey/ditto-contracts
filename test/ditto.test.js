const { expectRevert } = require('@openzeppelin/test-helpers');
const Ditto = artifacts.require('Ditto');

contract('Ditto', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.ditto = await Ditto.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.ditto.name();
        const symbol = await this.ditto.symbol();
        const decimals = await this.ditto.decimals();
        assert.equal(name.valueOf(), 'Ditto');
        assert.equal(symbol.valueOf(), 'DITTO');
        assert.equal(decimals.valueOf(), '9');
    });

    it('should have correct initial supply', async () => {
        const totalSupply = await this.ditto.totalSupply();
        assert.equal(totalSupply.valueOf(), '1750000000000000');
        assert.equal(aliceBal.valueOf(), totalSupply.valueOf());
    });

    it('should supply token transfers properly', async () => {
        await this.ditto.transfer(carol, '100', { from: alice });
        const carolBal = await this.ditto.balanceOf(carol);
        assert.equal(carolBal.valueOf(), '100');
    });

    it('should fail if you try to do bad transfers', async () => {
        await expectRevert(
            this.ditto.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
