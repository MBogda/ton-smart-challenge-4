import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import {Cell, toNano, TupleBuilder} from 'ton-core';
import { Task5 } from '../wrappers/Task5';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task5', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task5');
    });

    let blockchain: Blockchain;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task5 = blockchain.openContract(Task5.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task5.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task5 are ready to use
    });

    it('0, 0 -> []]', async () => {
        const result = await task5.getFibonacciSequence(0, 0);
        expect(result.value.remaining).toEqual(0);
    })

    it('1, 0 -> []]', async () => {
        const result = await task5.getFibonacciSequence(1, 0);
        expect(result.value.remaining).toEqual(0);
    })

    it('0, 1 -> [0]]', async () => {
        const result = await task5.getFibonacciSequence(0, 1);
        expect(result.value.remaining).toEqual(1);
        expect(result.value.readNumber()).toEqual(0);
    })

    it('1, 1 -> [1]]', async () => {
        const result = await task5.getFibonacciSequence(1, 1);
        expect(result.value.remaining).toEqual(1);
        expect(result.value.readNumber()).toEqual(1);
    })

    it('2, 1 -> [1]]', async () => {
        const result = await task5.getFibonacciSequence(2, 1);
        expect(result.value.remaining).toEqual(1);
        expect(result.value.readNumber()).toEqual(1);
    })

    it('3, 1 -> [2]]', async () => {
        const result = await task5.getFibonacciSequence(3, 1);
        expect(result.value.remaining).toEqual(1);
        expect(result.value.readNumber()).toEqual(2);
    })
});
