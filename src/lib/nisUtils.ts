import {AccountHttp, MosaicHttp, ServerConfig, TransactionHttp} from "nem-library";


const connectionPoolTestnet: ServerConfig[] = [
  { protocol:'https', domain: 'nis-testnet.44uk.net', port: 7891}
];

const connectionPoolMainnet: ServerConfig[] = [
  { protocol:'https', domain: 'aqualife1.supernode.me', port: 7891},
  { protocol:'https', domain: 'aqualife2.supernode.me', port: 7891},
  { protocol:'https', domain: 'aqualife3.supernode.me', port: 7891},
  { protocol:'https', domain: 'beny.supernode.me', port: 7891},
  { protocol:'https', domain: 'happy.supernode.me', port: 7891},
  { protocol:'https', domain: 'mnbhsgwbeta.supernode.me', port: 7891},
  { protocol:'https', domain: 'mnbhsgwgamma.supernode.me', port: 7891},
  { protocol:'https', domain: 'nemstrunk.supernode.me', port: 7891},
  { protocol:'https', domain: 'nemstrunk2.supernode.me', port: 7891},
  //{ protocol:'https', domain: 'nsm.supernode.me', port: 7891},
  { protocol:'https', domain: 'kohkei.supernode.me', port: 7891},
  { protocol:'https', domain: 'mttsukuba.supernode.me', port: 7891},
  { protocol:'https', domain: 'pegatennnag.supernode.me', port: 7891},
  { protocol:'https', domain: 'qora01.supernode.me', port: 7891},
  { protocol:'https', domain: 'shibuya.supernode.me', port: 7891},
  { protocol:'https', domain: 'strategic-trader-1.supernode.me', port: 7891},
  { protocol:'https', domain: 'strategic-trader-2.supernode.me', port: 7891},
  { protocol:'https', domain: 'qora01.supernode.me', port: 7891},
  { protocol:'https', domain: 'thomas1.supernode.me', port: 7891},
];

//const connectionPool = connectionPoolTestnet;
const connectionPool = connectionPoolMainnet;

export function getAccountHttp(): AccountHttp {
  return new AccountHttp(connectionPool);
}

export function getMosaicHttp(): MosaicHttp {
  return new MosaicHttp(connectionPool);
}

export function getTransactionHttp(): TransactionHttp {
  return new TransactionHttp(connectionPool);
}
