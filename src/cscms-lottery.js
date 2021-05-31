const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const interface = require('./abis/cscms-lottery.json')
const dayjs = require('dayjs')
require('dotenv').config()

const trigger = async () => {
	const provider = new HDWalletProvider({
		mnemonic: process.env.CSCMS_LOTTERY_MNEMONIC,
		providerOrUrl: process.env.CSCMS_LOTTERY_PROVIDER_ENDPOINT,
	})
	const web3 = new Web3(provider)
	const accounts = await web3.eth.getAccounts()
	const lottery = new web3.eth.Contract(interface, process.env.CSCMS_LOTTERY_ADDRESS)
	const endTime = await lottery.methods.endTime().call()
	const isBeforeEndtime = dayjs().isBefore(dayjs.unix(endTime))
	if (isBeforeEndtime) return
	await lottery.methods.pickWinner.send({
		from: accounts[0],
	})
}

trigger()
	.then(() => console.log('DONE triggering pick winner'))
	.catch(err => console.log(JSON.stringify(err)))
