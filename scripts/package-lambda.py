from pathlib import Path
import zipfile, stat
root=Path.cwd()
out=root/'.sites-runtime/novastore-lambda.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for base,prefix in [(root/'.next/standalone',''),(root/'.next/static','.next/static'),(root/'public','public')]:
        for p in base.rglob('*'):
            if not p.is_file(): continue
            relative=p.relative_to(base)
            if any(part.startswith('.env') for part in relative.parts) or 'cache' in relative.parts: continue
            name=(Path(prefix)/relative).as_posix()
            info=zipfile.ZipInfo(name)
            info.create_system=3
            info.external_attr=(stat.S_IFREG|0o644)<<16
            info.compress_type=zipfile.ZIP_DEFLATED
            z.writestr(info,p.read_bytes())
    info=zipfile.ZipInfo('run.sh');info.create_system=3;info.external_attr=(stat.S_IFREG|0o755)<<16
    z.writestr(info,'#!/bin/bash\ncd /var/task\nHOSTNAME=0.0.0.0 exec node server.js\n')
print(f'Lambda archive ready: {out.stat().st_size} bytes')
