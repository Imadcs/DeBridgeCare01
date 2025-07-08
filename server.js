const express = require('express');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const app = express();

app.use(express.json());

app.post('/getbalance', async (req, res) => {
    const { identity } = req.body;
    try {
        const { stdout } = await execPromise(
            `qubic-cli.exe -nodeip 67.222.157.65 -nodeport 31841 -getbalance ${identity}`
        );
        const balanceMatch = stdout.match(/Balance: (\d+)/);
        res.json({ balance: balanceMatch ? balanceMatch[1] : '0' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/sendcustomtransaction', async (req, res) => {
    const { identity, solanaAddress, amount, extraData } = req.body;
    try {
        const { stdout } = await execPromise(
            `qubic-cli.exe -nodeip 67.222.157.65 -nodeport 31841 -seed aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa -sendcustomtransaction ${identity} ${amount} 0 10 ${extraData}`
        );
        const txHashMatch = stdout.match(/TxHash: (\w+)/);
        const tickMatch = stdout.match(/Tick: (\d+)/);
        res.json({
            txHash: txHashMatch ? txHashMatch[1] : '',
            tick: tickMatch ? tickMatch[1] : ''
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/checktxontick', async (req, res) => {
    const { tick, txHash } = req.body;
    try {
        const { stdout } = await execPromise(
            `qubic-cli.exe -nodeip 67.222.157.65 -nodeport 31841 -checktxontick ${tick} ${txHash}`
        );
        const status = stdout.includes('is included') ? 'Confirmed' : 'Not found';
        res.json({ status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));