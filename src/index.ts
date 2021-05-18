import {
  Web3ProviderEngine,
  LedgerSubprovider,
  RPCSubprovider,
} from '@0x/subproviders';
import Eth from '@ledgerhq/hw-app-eth';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';

export interface ILedgerProviderOptions {
  chainId: number;
  rpcUrl: string;
}

async function ledgerEthereumClientFactoryAsync() {
  const ledgerConnection = await TransportWebHID.create();
  const ledgerEthClient = new Eth(ledgerConnection);
  return ledgerEthClient;
}

class LedgerProvider extends Web3ProviderEngine {
  constructor(opts) {
    super({
      pollingInterval: opts.pollingInterval,
    });
    const ledgerWalletConfigs = {
      networkId: opts.chainId,
      ledgerEthereumClientFactoryAsync,
    };

    const ledgerSubprovider = new LedgerSubprovider(ledgerWalletConfigs);
    this.addProvider(ledgerSubprovider);
    this.addProvider(new RPCSubprovider(opts.rpcUrl));

    this.start();
  }
}

export default LedgerProvider;
