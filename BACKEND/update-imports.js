const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function (filePath) {
    if (filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // We can compute the relative path to src/shared/enums/roles.enum.ts based on the file depth
        let depth = filePath.split(path.sep).length - 2; // src is depth 0. e.g. src/modules/auth/auth.controller.ts is length 4 (src, modules, auth, auth.controller.ts). Depth from folder to src = 2.
        let relPath = Array(depth).fill('..').join('/');
        if (relPath === '') relPath = '.';
        let sharedPath = `${relPath}/shared/enums/roles.enum`;

        // 1. { UserRole } only
        let regex1 = /import\s*\{\s*UserRole\s*\}\s*from\s*(['"])[^'"]+user\.schema\1;?/g;
        content = content.replace(regex1, `import { UserRole } from '${sharedPath}';`);

        // 2. { User, UserRole }
        let regex2 = /import\s*\{\s*User\s*,\s*UserRole\s*\}\s*from\s*(['"])([^'"]+user\.schema)\1;?/g;
        content = content.replace(regex2, `import { User } from '$1$2$1';\nimport { UserRole } from '${sharedPath}';`);

        // 3. { UserRole, User }
        let regex3 = /import\s*\{\s*UserRole\s*,\s*User\s*\}\s*from\s*(['"])([^'"]+user\.schema)\1;?/g;
        content = content.replace(regex3, `import { User } from '$1$2$1';\nimport { UserRole } from '${sharedPath}';`);

        if (content !== original) {
            fs.writeFileSync(filePath, content);
            console.log('Updated', filePath);
        }
    }
});
