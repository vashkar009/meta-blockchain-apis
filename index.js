const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
var { encode, decode } = require("js-base64");
const jwt_decode = require('jwt-decode');
const Web3 = require('web3');
var CONTACT_ABI = require("./ABI.json");
var CONTACT_ADDRESS = require("./Address.json");
const HDWalletProvider = require('@truffle/hdwallet-provider');
app.use(cors());
app.use(express.json());
const authToken =  "77a5ad97-2213-4d6c-8ebc-7f16cca13df9";
const getConfig = (WalletPrivateKey,InfuraNodeURL) => {
		

	var mnemonic = WalletPrivateKey;
	const provider =  new HDWalletProvider(mnemonic, InfuraNodeURL);
	var web3 = new Web3(provider);
    const signer = web3.eth.accounts.privateKeyToAccount(WalletPrivateKey);
	web3.eth.accounts.wallet.add(signer);
	const contactList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
	return { contactList, signer  };
  };


app.get("/", async (req, res) => {
 
	try {
	  res.json({
		message: "The api's is up and Running for meta-node-blockchain",
		status: "true",
	  });
	} catch (error) {
	  console.log(error);
	}
  });

const start = async function() {}
start();
  


//// Create Token
	app.post("/create", async(req, res) => {

		
		
	    if (!req.headers["auth-token"]) 
		{
		 	return res.status(401).json({ message: "Missing Authorization Header" });
		}
		else
		{
			const authTokenDecoded = jwt_decode(req.headers["auth-token"]);
			const ApplicationUID = authTokenDecoded.ApplicationUID;
			

			if(authToken != ApplicationUID)
			return res.status(401).json({ message: "Auth Token Mismatched" });

			if (!req.body) return res.status(401).json({ message: "Body Missing" });;
			const orchestrarData = req.body;
			const configurationDataArray = orchestrarData.headers.applicationHeaders;
            if(orchestrarData.headers.applicationHeaders[5].keyName == "InfuraNodeURL")
			{
				var InfuraNodeURL = orchestrarData.headers.applicationHeaders[5].keyValue;
			}
			else
			{
				return res.status(401).json({ message: "Missing InfuraNodeURL" });
			}
			if(orchestrarData.headers.applicationHeaders[3].keyName == "WalletPrivateKey")
			{
				var WalletPrivateKey = orchestrarData.headers.applicationHeaders[3].keyValue;
			}
			else
			{
				return res.status(401).json({ message: "Missing WalletPrivateKey" });
			}
			 
			const { contactList, signer } = getConfig(WalletPrivateKey,InfuraNodeURL);
			app.use(express.json());
			
			try {
				const response = await contactList.methods.create()
				  .send({
					  from: signer.address,
					  value: 0,
					  gasLimit: 5000000,
					  gasPrice: 100000000,
					  
					})
	  
					.once('sending', function(payload){ console.log(`Sending transaction ...`);
					console.log(payload);
					
					return payload; })
	  
					.once('sent', function(payload){ console.log(`sent transaction ...`);
					console.log(payload);
					
					return payload;})
	  
					.on ('error', function(errorlog){ console.log(`error log ...`);
					console.log(errorlog);
					
					return errorlog;})
				  
					.once('transactionHash', (txhash) => {
					console.log(`Minting transaction ...`);
					console.log(txhash);
					
					return txhash;
					
					
	  
				  })
	  
				  .on ('error', function(errorlog){ console.log(`error log ...`);
					console.log(errorlog);
					
					return errorlog;})
	  
				  .catch((error) => {
					const errorData = { error };
					return { error: errorData.error };
				  });
	  
				
				res.json(response);
			  } 
			  catch (error) {
				console.log(error);
			  }
		}
	   
	});


//// Get All Token

	app.post("/getAllTokens", async (req, res) => {

		if (!req.headers["auth-token"]) 
		{
		 	return res.status(401).json({ message: "Missing Authorization Header" });
		}
		else
		{
			const authTokenDecoded = jwt_decode(req.headers["auth-token"]);
			const ApplicationUID = authTokenDecoded.ApplicationUID;
			

			if(authToken != ApplicationUID)
			return res.status(401).json({ message: "Auth Token Mismatched" });

			if (!req.body) return res.status(401).json({ message: "Body Missing" });;
			const orchestrarData = req.body;
			const configurationDataArray = orchestrarData.headers.applicationHeaders;

			if(orchestrarData.headers.applicationHeaders[5].keyName == "InfuraNodeURL")
			{
				var InfuraNodeURL = orchestrarData.headers.applicationHeaders[5].keyValue;
			}
			else
			{
				return res.status(401).json({ message: "Missing InfuraNodeURL" });
			}
			if(orchestrarData.headers.applicationHeaders[3].keyName == "WalletPrivateKey")
			{
				var WalletPrivateKey = orchestrarData.headers.applicationHeaders[3].keyValue;
			}
			else
			{
				return res.status(401).json({ message: "Missing WalletPrivateKey" });
			}
			 
			const { contactList, signer } = getConfig(WalletPrivateKey,InfuraNodeURL);
			app.use(express.json());

		}
		const { contactList, signer } = getConfig(WalletPrivateKey,InfuraNodeURL);
		app.use(express.json());


		  try {
			const response = await contactList.methods
			  .getToken()
			  .call({from: signer.address});
			// console.log(tokenDecoded);
			//  console.log(signer);
			res.json(response);
		  } catch (error) {
			console.log(error);

		  }
			
		});


		



////Add token Data

// app.post("/initiate-token-info", async (req, res) => {

// 	if (!req.headers["app-config-token"]) 
// 	{
// 		return res.status(401).json({ message: "Missing Authorization Header" });
// 	}
// 	 const { contactList, signer } = getConfig(req.headers["app-config-token"]);
    
// 	if (!req.body) res.json("Please add body");
// 	const tokenUID = req.query.token;
// 	if (!tokenUID) res.json("Token id missing");
// 	const tokenURI = JSON.stringify(req.body);
	

// 	try {
// 	  const response = await contactList.methods
// 		.addData(tokenUID, tokenURI)
// 		.send({
// 		  from: signer.address,
// 		  value: 0,
//           gasLimit: 5000000,
// 		  gasPrice: 100000000,
// 		})
// 		.once("transactionHash", (txhash) => {
// 		  console.log(`Adding Token Info ...`);
// 		  console.log(txhash);
// 		  return txhash;
// 		})
// 		.catch((error) => {
// 		  const errorData = { error };
// 		  return { error: errorData.error };

// 		});
// 	  res.json(response);
// 	} catch (error) {
// 		res.json(error);
// 	  console.log(error);
// 	}
//   });


  ///// Get Token Data

//   app.get("/get-token-data", async (req, res) => {
	
// 	if (!req.headers["app-config-token"]) 
// 	{
// 		return res.status(401).json({ message: "Missing Authorization Header" });
// 	}
// 	const { contactList, signer } = getConfig(req.headers["app-config-token"]);
// 	const tokenId = req?.query?.token;
// 	try {
// 	  const response = await contactList.methods
// 		.tokenURI(tokenId)
// 		.call({from: signer.address});
// 	  const outputData = response && JSON.parse(response);
// 	  res.json(outputData);
// 	} catch (error) {
// 	  console.log(error);
// 	}
//   });



   /// Add Transaction

//   app.post("/add-transaction", async (req, res) => {
	
// 	if (!req.headers["app-config-token"]) 
// 	{
// 		return res.status(401).json({ message: "Missing Authorization Header" });
// 	}
// 	const { contactList, signer } = getConfig(req.headers["app-config-token"]);
// 	if (!req.body) res.json("Please add body");
  
// 	const tokenUID = req?.query?.token;
// 	if (!tokenUID) res.json("Token id missing");
  
// 	const response = await contactList.methods
// 	  .tokenURI(tokenUID)
// 	  .call({  from: signer.address });
// 	const tokenData = response && JSON.parse(response);
// 	if (tokenData?.transction) {
// 	  tokenData.transction.push(req.body);
// 	} else {
// 	  const transaction = [req.body];
// 	  tokenData.transction = transaction;
// 	}
  
// 	const tokenURI = JSON.stringify(tokenData);
// 	try {
// 	  const response = await contactList.methods
// 		.addData(tokenUID, tokenURI)
// 		.send({
// 		  from: signer.address,
// 		  value: 0,
//           gasLimit: 5000000,
// 		  gasPrice: 100000000,
// 		})
// 		.once("transactionHash", (txhash) => {
// 		  console.log(`Adding transaction ...`);
// 		  console.log(txhash);
// 		  return txhash;
// 		})
// 		.catch((error) => {
// 		  const errorData = { error };
// 		  return { error: errorData.error };
// 		});
// 	  res.json(response);
// 	} catch (error) {
// 	  console.log(error);
// 	}
//   });

  /// Assign Token

//   app.post("/assign-token", async (req, res) => {
	
// 	if (!req.headers["app-config-token"]) 
// 	{
// 		return res.status(401).json({ message: "Missing Authorization Header" });
// 	}
// 	const { contactList, signer } = getConfig(req.headers["app-config-token"]);
	
// 	if (!req.body) res.json("Please add body");
  
// 	const tokenUID = req?.query?.token;
// 	if (!tokenUID) res.json("Token id missing");
  
// 	const response = await contactList.methods
// 	  .tokenURI(tokenUID)
// 	  .call({  from: signer.address });
// 	const tokenData = response && JSON.parse(response);
// 	if (tokenData?.userdetails) {
// 	  tokenData.userdetails.push(req.body);
// 	} else {
// 	  const userdetails = [req.body];
// 	  tokenData.userdetails = userdetails;
// 	}
  
// 	const tokenURI = JSON.stringify(tokenData);
// 	try {
// 	  const response = await contactList.methods
// 		.addData(tokenUID, tokenURI)
// 		.send({
// 			from: signer.address,
// 			value: 0,
// 			gasLimit: 5000000,
// 			gasPrice: 100000000,
// 		})
// 		.once("transactionHash", (txhash) => {
// 		  console.log(`Minting transaction ...`);
// 		  console.log(txhash);
// 		  return txhash;
// 		})
// 		.catch((error) => {
// 		  const errorData = { error };
// 		  return { error: errorData.error };
// 		});
// 	  res.json(response);
// 	} catch (error) {
// 	  console.log(error);
// 	}
//   });

  app.listen(process.env.PORT || 3080, () => {
	console.log('listening on port '+ (process.env.PORT || 3080));
	
});


