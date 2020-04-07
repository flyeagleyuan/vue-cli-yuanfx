const gulp = require('gulp'),
  minimist = require('minimist'),
  gulpSSH = require('gulp-ssh'),
  fs = require('fs'),
  glob = require('glob'),
  shell = require('shelljs');

const projectSVN = 'https://192.168.100.188/svn/jso/finchinaAPP/WebContent',
  serverPath = '/opt/tomcat-search/webapps/finchinaAPP/f9',
  bundlePath = './f9',
  commitMsg = 'DDC-11807 你的ims信息备注';

gulp.task('build', cb => {
  shell.rm('-rf', bundlePath);
  const { path: buildPath } = minimist(process.argv.slice(2));
  if (buildPath) {
    console.log(`------------------begin build ${buildPath}------------------`);
    shell.exec(`yarn build --path ${buildPath}`);
    console.log(`------------------finish build ${buildPath}------------------`);
  } else {
    glob.sync('./src/pages/*').forEach(path => {
      const stat = fs.statSync(path);
      if (stat.isDirectory()) {
        const model = path.replace('./src/pages/', '');
        console.log(`------------------begin build ${model}------------------`);
        shell.exec(`yarn build --path ${model}`);
        console.log(`------------------finish build ${model}------------------`);
      }
    });
  }
  cb();
});

gulp.task('checkout', () => {
  return shell.exec(`svn checkout ${projectSVN}`);
});

gulp.task('checkIn', cb => {
  const msgOptions = {
    string: 'm',
    default: { m: commitMsg },
  };
  const options = minimist(process.argv.slice(2), msgOptions);
  const svnProjectPath = projectSVN.split('/').pop();
  shell.cp('-R', bundlePath, svnProjectPath);

  shell.cd(svnProjectPath);
  shell.exec('svn add * --force');
  shell.exec(`svn commit -m "${options.m}"`);
  shell.cd('..');
  cb();
});

gulp.task('removeMap', cb => {
  shell.rm('./dist/**/assets/**/*.map');
  cb();
});

gulp.task('upload', cb => {
  const ssh = new gulpSSH({
    ignoreErrors: false,
    sshConfig: {
      host: '10.15.97.30',
      username: 'root',
      password: '',
    },
  });
  setTimeout(() => {
    gulp.src(`${bundlePath}/**`).pipe(ssh.dest(serverPath));
    cb();
  }, 1000);
});

gulp.task('all', gulp.series('build', 'checkout', 'checkIn', 'upload'));

gulp.task('checkInUpload', gulp.series('checkout', 'checkIn', 'upload'));
y;
