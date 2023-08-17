import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import {beginCell, Cell, toNano} from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import {stringToCell} from "ton-core/dist/boc/utils/strings";

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use
    });

    it('(encrypt) abc -> bcd', async () => {
        const result = await task4.getCaesarCipherEncrypt(1, 'abc');
        expect(result.value).toEqualCell(Task4.cellFromString('bcd'));
    })

    it('(decrypt) abc -> bcd', async () => {
        const result = await task4.getCaesarCipherDencrypt(1, 'bcd');
        expect(result.value).toEqualCell(Task4.cellFromString('abc'));
    })

    it('(encrypt) abc -> yza', async () => {
        const result = await task4.getCaesarCipherEncrypt(24, 'abc');
        expect(result.value).toEqualCell(Task4.cellFromString('yza'));
    })

    it('(decrypt) abc -> yza', async () => {
        const result = await task4.getCaesarCipherDencrypt(24, 'yza');
        expect(result.value).toEqualCell(Task4.cellFromString('abc'));
    })

    it('(encrypt) 2 cells', async () => {
        const init = 'a'.repeat(123) + 'b'
        const expected = 'b'.repeat(123) + 'c'
        const result = await task4.getCaesarCipherEncrypt(1, init);
        expect(result.value).toEqualCell(Task4.cellFromString(expected));
        console.log(result.gas);
    })

    it('(encrypt) 3 cells', async () => {
        const init = 'a'.repeat(123) + 'b'.repeat(127) + 'c'
        const expected = 'b'.repeat(123) + 'c'.repeat(127) + 'd'
        const result = await task4.getCaesarCipherEncrypt(1, init);
        expect(result.value).toEqualCell(Task4.cellFromString(expected));
        console.log(result.gas);
    })
});
