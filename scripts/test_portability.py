from pathlib import Path
import json,os,pathlib,subprocess,tempfile,unittest
BASE=pathlib.Path(__file__).resolve().parents[1]
class PortabilityRegression(unittest.TestCase):
 def test_catalog_preserves_platform_packages_from_standalone_locks(self):
  root=json.loads((BASE/'package-lock.json').read_text())['packages']
  for p in (BASE/'templates').glob('*/package-lock.json'):
   for k,v in json.loads(p.read_text())['packages'].items():
    if k and (v.get('os') or v.get('cpu')):
     self.assertIn(k,root,str(p));self.assertEqual(root[k].get('version'),v.get('version'))
 def test_handoff_accepts_https_and_ssh_and_rejects_wrong_repo(self):
  with tempfile.TemporaryDirectory(prefix='website-handoff-test-') as d:
   git=pathlib.Path(d)/'git'
   git.write_text('#!/usr/bin/env python3\nimport sys,os\na=sys.argv[1:]\nif a==["rev-parse","--is-inside-work-tree"]:print("true")\nelif a[:2]==["config","--get"]:print(os.environ["TEST_REMOTE"])\nelif a==["branch","--show-current"]:print("main")\nelif a==["status","--porcelain"]:pass\nelif a==["ls-files"]:print("index.html")\nelif a==["rev-parse","HEAD"]:print("abc123")\nelif a[0]=="ls-remote":print("abc123\\trefs/heads/main")\nelse:sys.exit(2)\n');git.chmod(0o700)
   for script in (BASE/'templates').glob('*/scripts/verify-handoff.mjs'):
    for remote,passed in [('https://github.com/paofu456/new-site.git',True),('git@github.com:paofu456/new-site.git',True),('ssh://git@github.com/paofu456/new-site.git',True),('https://github.com/paofu456/wrong.git',False),('https://example.com/paofu456/new-site.git',False)]:
     with self.subTest(script=str(script),remote=remote):
      r=subprocess.run(['node',str(script),'--owner','paofu456','--repo','new-site'],cwd=d,env={**os.environ,'PATH':d+os.pathsep+os.environ['PATH'],'TEST_REMOTE':remote},capture_output=True,text=True)
      self.assertEqual(r.returncode==0,passed,r.stdout+r.stderr)
class WorkflowRegression(unittest.TestCase):
 def test_no_legacy_provider_in_workflow(self):
  root = Path(__file__).resolve().parents[1]
  for directory in ('agent-skills', 'docs', 'templates'):
   for file in (root / directory).rglob('*'):
    if file.suffix in ('.md', '.mjs') and not any(x in file.parts for x in ('node_modules', 'dist', '.astro')):
     self.assertNotIn('gi' + 'tee', file.read_text().lower(), str(file))

if __name__=='__main__':unittest.main()
