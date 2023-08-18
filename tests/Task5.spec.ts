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

    it('0, 5 -> [0, 1, 1, 2, 3]]', async () => {
        const result = await task5.getFibonacciSequence(0, 5);
        expect(result.value.remaining).toEqual(5);
        expect(result.value.readNumber()).toEqual(0);
        expect(result.value.readNumber()).toEqual(1);
        expect(result.value.readNumber()).toEqual(1);
        expect(result.value.readNumber()).toEqual(2);
        expect(result.value.readNumber()).toEqual(3);
    })

    it('4, 5 -> [3, 5, 8, 13, 21]]', async () => {
        const result = await task5.getFibonacciSequence(4, 5);
        expect(result.value.remaining).toEqual(5);
        expect(result.value.readNumber()).toEqual(3);
        expect(result.value.readNumber()).toEqual(5);
        expect(result.value.readNumber()).toEqual(8);
        expect(result.value.readNumber()).toEqual(13);
        expect(result.value.readNumber()).toEqual(21);
    })

    it('370, 1 -> [94611056096305838013295371573764256526437182762229865607320618320601813254535]]', async () => {
        const result = await task5.getFibonacciSequence(370, 1);
        expect(result.value.remaining).toEqual(1);
        expect(result.value.readBigNumber()).toEqual(BigInt("94611056096305838013295371573764256526437182762229865607320618320601813254535"));
    })

    it('369, 2 -> [58472848379039952684853851736901133239741266891456844557261755914039063645794, 94611056096305838013295371573764256526437182762229865607320618320601813254535]]', async () => {
        const result = await task5.getFibonacciSequence(369, 2);
        expect(result.value.remaining).toEqual(2);
        expect(result.value.readBigNumber()).toEqual(BigInt("58472848379039952684853851736901133239741266891456844557261755914039063645794"));
        expect(result.value.readBigNumber()).toEqual(BigInt("94611056096305838013295371573764256526437182762229865607320618320601813254535"));
    })
});
