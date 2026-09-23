// Explicit publishing command. Run only after reviewing and committing all changes.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const cwd=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const binary=process.env.DEMO_GIT || 'git';
const run=(args,options={})=>(execFileSync(binary,args,{cwd,encoding:'utf8',...options}) || '').trim();
if(run(['status','--porcelain']))throw new Error('変更を確認してコミットしてから実行してください。');
const branch=run(['branch','--show-current']);
if(branch!=='codex/hair-graft-demo')throw new Error('ソースブランチ codex/hair-graft-demo で実行してください。');
const remote=run(['remote','get-url','origin']);
if(!/github\.com[:/][^/]+\/hair-graft-demo-20260923(?:\.git)?$/.test(remote))throw new Error('意図したデモ用リポジトリか確認してください。');
const tree=run(['rev-parse','HEAD:dist']);
let parent=[];try{parent=['-p',run(['rev-parse','refs/heads/gh-pages'])];}catch{}
const commit=run(['commit-tree',tree,...parent],{input:'Publish reviewed static demo\n'});
run(['update-ref','refs/heads/gh-pages',commit]);
run(['push','-u','origin',branch,'gh-pages'],{stdio:'inherit'});
console.log('公開ブランチをpushしました。GitHub Pagesのデプロイ結果を確認してください。');
