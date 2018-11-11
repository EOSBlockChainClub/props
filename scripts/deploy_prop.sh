
	# chmod 755 deploy_staging.sh
	# alias cleosbuild="cleos -u http://localhost:8888"

	# NOTE: This script assumes that you've run the eos build script (which results in a /build directory)
	# NOTE: You must unlock the default wallet first

	# path to install directory
	eospath=~/code/eos
    proppath=~/code/props

	# eos server node address
    eosnode=http://localhost:8888

	walletName=buidlocal

	#cleos
	cleos="cleos -u $eosnode"

	# usefull functions
	generateKeys() {
		export keys=`cleos create key`
		echo $keys | awk '{print $3; print $6}' | $quiet $quiet
		export publickey=$(echo $keys | awk '{print $6}')
		export privatekey=$(echo $keys | awk '{print $3}')
		$cleos wallet import $privatekey -n $walletName
	}

	generateOwnerActiveKeys() {
		generateKeys
		export ownerpublickey=$publickey
		export ownerprivatekey=$privatekey
		generateKeys
		export activepublickey=$publickey
		export activeprivatekey=$privatekey
	}

	createWallet() {
		walletParam=$1
		echo creating wallet $walletParam
		rm -rf ~/eosio-wallet/./$walletParam.wallet
		$cleos wallet create -n build > scriptout/$walletParam-wallet-info.txt
		cat scriptout/$walletParam-wallet-info.txt
	}

	createAccount() {
		payerAccount=$1; accountName=$2; ownerpublickey=$3; activepublickey=$4; stakeNet=$5; stakeCpu=$6; buyRam=$7; buyRamKbytes=$8;
		# generateOwnerActiveKeys
        #log account details
        #printf "Account %s\n     owner keys: public:%s private:%s\n     active keys: public:%s private:%s\n" "$accountName" "$ownerpublickey" "$ownerprivatekey" "$activepublickey" "$activeprivatekey" >> scriptout/accounts.txt

		if [ -z "$stakeNet" -a -z "$stakeCpu" -a -z "$buyRam" -a -z "$buyRamKbytes" ];
		then
			#use simple account create
            #echo "cleos create account " $payerAccount " " $accountName " " $ownerpublickey " " $activepublickey >> scriptout/accounts.txt
			$cleos create account $payerAccount $accountName $ownerpublickey $activepublickey
		else
			#use system account create
			#echo "cleos system newaccount --stake-net \"$stakeNet SYS\" --stake-cpu \"$stakeCpu SYS\" --buy-ram \"$buyRam SYS\" --buy-ram-kbytes $buyRamKbytes $payerAccount $accountName $ownerpublickey $activepublickey "  >> scriptout/accounts.txt "\n\n"
			# older syntax <= 1.0.5  $cleos system newaccount --stake-net "$stakeNet SYS" --stake-cpu "$stakeCpu SYS" --buy-ram-EOS "$buyRam SYS" --buy-ram-bytes $buyRamKbytes $payerAccount $accountName $ownerpublickey $activepublickey
			$cleos system newaccount --stake-net "$stakeNet SYS" --stake-cpu "$stakeCpu SYS" --buy-ram "$buyRam SYS" --buy-ram-kbytes $buyRamKbytes $payerAccount $accountName $ownerpublickey $activepublickey
		fi
	}

	getAccountPublicKeys() {
		accountName=$1
		# get 4th column of output (the keys) then grabs the first line (NR==1) that starts with EOS
		ownerKey=$($cleos get account $accountName | awk '{print $4}' | awk '/^EOS/{print}' | awk 'NR==1{print}')
        activeKey=$($cleos get account $accountName | awk '{print $4}' | awk '/^EOS/{print}' | awk 'NR==2{print}')
	}

	# follows boot sequence defined here: https://developers.eos.io/eosio-nodeos/docs/bios-boot-sequence
	installSystem() {
		# IMPORTANT: For production chain, generate a keypair for EOSIO account and import into wallet and launch node using it (don't use the default keys)

		#...this code generate a key pair for eosio and provides the nodeos launch command for it
		# generateKeys
		# echo run this command in another window to launch node. Then press Enter
		# echo $eospath/build/programs/nodeos/nodeos -e -p eosio --signature-provider=$publickey=KEY:$privatekey --plugin eosio::chain_api_plugin --plugin eosio::history_api_plugin --delete-all-blocks
		# read waiting
		echo
		echo "-----> Step 2a - create system accounts".
		echo
		createAccount eosio eosio.bpay EOS5Wv728YFzLp7JPbamkT4CtWTLWiHeaACPtArnDGnq1tHj3JG6m EOS5MCQBpbxv9bHJ3W5ME4gW4VkHVKKuqRbqLC8SR14Cp5WpWGGSd
	    createAccount eosio eosio.msig EOS5XS67foWtQuSPoRW36xD8CrLo8zNBcRVzrzWnrvvFrbdEnotY5 EOS5uqwvuvHKDfYs6wAwEAYHgY1KpjTaKaUfeJEZD1JbBFGV2QPmb
	    createAccount eosio eosio.names EOS6hZQbS7mKoCyLv5544d3kZU46jFxrBAWwGqwoYK98cU2TH5F7F EOS51FnVVBVmriFz9wmRUBTEmwjJNJB9W3BkpkQk3Ek8yMB5rrYSj
		createAccount eosio eosio.ram EOS83jc1jGTUE8wbyYkttwQafj4CBZaTna5SuSjV64uWdArqDDbZp EOS6KDtwxXFSoUbwTCJn94G7HpdHRpohA3vQZGtWTzz9rs7iMc7eY
	    createAccount eosio eosio.ramfee EOS8dSGiRZ1GhtRHCgLtKkrJqQHircvZNhPnWH9iGF62Mjw3YvkCt EOS6BztSc3yGJvnAgeFnEm4MpixwtgorriDnmnfy1FrVySDSFatZc
	    createAccount eosio eosio.saving EOS89dCdjXFnD64RM1zUBaPZSvjCJaUq9UBSyLHgFPGWJRbZexwFf EOS7HKnejH19k3NrS1GgSHEBTCJzQnd3Nbaw2inFHJGn3vo3bmStJ
	    createAccount eosio eosio.stake EOS7ymuJmYjw6SXYrZh36DfErS1nDLBda5AwxPekK1jokg1HBSn9J EOS6nFsP5eirSk5a8yN2Vd4nbAe9s5fNXPvoJvArkBCenCASQB6RM
	    createAccount eosio eosio.token EOS6TRXStiN2fZ1UPuQr3SEAhGpRoaLJrGGta98gHDEc1aovUMKoM EOS58j1twKgi6wUWVbi729uLxvm4rM7R858nfF1E8UWLzuRzooDYa
	    createAccount eosio eosio.vpay EOS6AVTLLCE1dtHNpAYNVYBLAdye4PKNPEf57w8JPUETEJm3cMjXj EOS5TovTCTJiwZvxCLeiSC3eXDUqVvF8365KdLo1KxMhmrgeHp1eM
		echo
		echo "-----> Step 2b - install eosio.token and eosio.msig contracts".
		echo
	    #install our standard token contract to be used as eosio.token
		$cleos set contract eosio.token $eospath/build/contracts/eosio.token
		$cleos set contract eosio.msig  $eospath/build/contracts/eosio.msig
		echo
		echo "-----> Step 2c - initial funding of SYS for chain".
		echo
		$cleos push action eosio.token create '[ "eosio", "10000000000.0000 SYS" ]' -p eosio.token
		$cleos push action eosio.token issue '[ "eosio", "1000000000.0000 SYS", "initial funding of SYS for chain" ]' -p eosio
		echo
		echo "-----> Step 2d - set system contract".
		echo
		sleep 2  #delay to let transactions complete
		$cleos set contract eosio $eospath/build/contracts/eosio.system
		sleep 2  #delay to let transactions complete
	}

	# Run Script

	# Start a clean EOS node
	# Start node with clean Genesis state - deletes existing data
	# $eospath/build/programs/nodeos/nodeos -e -p eosio --plugin eosio::chain_api_plugin --plugin eosio::history_api_plugin --delete-all-blocks
	echo
	echo "-----> IMPORTANT - unlock default wallet before running"
	echo


	# Create wallet for build script - Note: wallet is stored locally on your machine in ~/eosio-wallet directory
		echo
		echo "-----> Step 1 - make sure the wallet is unlocked and has keys imported (different script)"
		echo


		# Create wallet for build script - Note: wallet is stored locally on your machine in ~/eosio-wallet directory
		echo
		echo "-----> Step 2 - install system contract"
		echo
		installSystem

		# Create and fund accounts that will create child contract accounts
		echo
		echo "-----> Step 3 - create prop account"
		echo

		createAccount eosio props EOS8AMLwSTzCyMuynqGA5PYNqNZPbr6bnh92833brrMVMyG6e2Pz2 EOS6jmJYKkuwBarxdjFVn1jJvenvyizrUpKdBXLas46hx9oyawcBH 1000000 1000000 1000000 16
		$cleos push action eosio.token transfer '["eosio", "props", "20000000.0000 SYS", "initial funding of props"]' -p eosio

        createAccount props token.props EOS5FAtNaj1vn2bp91AvmPUq1L2yyeHSDRyeTtJ7SA3X9JY32YwTp EOS6LcfCaHYgiosQkB7Kqc7MdmeP64ZQNG9beKRt79EFLE5K81vKi 100000 100000 100000 16
        $cleos push action eosio.token transfer '["eosio", "token.props", "20000000.0000 SYS", "initial funding of token.props"]' -p eosio

		# create test accounts
		createAccount props test1.props EOS6tg5CSgEfmRq4jDAFVYwRTCBSGdPg4Y8FhTAVxpg7RuQxUprYo EOS4xJvy2tYU21reKbbq4RPLxgzxNmrLtidVWpio5Ggwisfkgzg2L 1 1 1 8
		createAccount props test2.props EOS7WyU91Fu5nUJXDyZSMNUbNvTMWyY4iYQiXKrHjJf9g5V8dp7CS EOS8UGzRNqjq7AZDbY2a7cBDaLYhPKW66LhjbwpkpyYcVYxoi9dGv 1 1 1 8

		#fund the master accounts so they can create other accounts

	    # deploy contracts
	    $cleos set contract token.props $proppath/contracts/props.token

        # fund the contracts with cpu
        $cleos push action token.props create '["token.props", "100000000.0000 PROP", "create PROP"]' -p token.props
        $cleos push action token.props issue '["token.props", "10000000.0000 PROP","issue PROP"]' -p token.props
        $cleos push action token.props transfer '["token.props", "test1.props", "10.0000 PROP","transfer PROP"]' -p token.props