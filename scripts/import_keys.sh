
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

	#to run from docker
	#cleosdeploy="docker exec -it eosio /opt/eosio/bin/cleos --url http://127.0.0.1:8888 --wallet-url http://127.0.0.1:5555"
    
    importKeys(){
        privatekey=$1
        $cleos wallet import --private-key $privatekey -n $walletName
    }

    importKeys 5Hwvnwgw64fMgCo5d31vGJdZ1aVRd7nskwfEW5cLZxTgFJQ9PWs
    importKeys 5JzGex2jjMXH2hQyea1gCZcyxnj96efJAPQsgeEQxcSShSbbtcH
    importKeys 5JcmSsWbFxJrvUHWtMmWPzxsRRwuKAYzUQsi5RAe5utSjTe5pTB
    importKeys 5KEArEq9ydqtPXcAMWvzqavkVcHd6KrpLHkyLJuRX8VBHUMu96X
    importKeys 5K3ej5wkHMBZAmq5XMby1qgkbGkwwhdnQy6KZx5armRBpEnCKNW
    importKeys 5KecUJG87uPfeRoYgHKfHnqxPKGUDWdbM9qxWjP2hjGMXVN13ng
    importKeys 5JsrrApxxhKfSRCg9qrCrbTkyV4VYJQak22q8cisoz6naef6nsZ
    importKeys 5Jzb7m5JyFZyY3trarekasXqyRKEcSoEixQ5MaiE6LBoPzJyC1f