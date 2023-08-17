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

    it('abc -> bcd', async () => {
        const result = await task4.getCaesarCipherEncrypt(1, 'abc');
        expect(result).toEqualCell(Task4.cellFromString('bcd'));
    })

    // it('tmp', async () => {
    //     const a = stringToCell('a');
    //     // const b = beginCell().storeUint(0, 32).storeUint(97, 8).endCell();
    //     const b = beginCell().storeUint(97, 8).endCell();
    //     expect(b).toEqualCell(a);
    // })
});
