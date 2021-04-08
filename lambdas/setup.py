import os
import sys

package ='''{
  "name": "###",
  "version": "1.0.0",
  "description": "@@@",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "start": "zip -r ../out/###.zip *"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/code-gambit/VT-lambdas"
  },
  "author": "Lakshya Bansal <https://github.com/lakshya-20>",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/code-gambit/VT-lambdas/issues"
  },
  "homepage": "https://github.com/code-gambit/VT-lambdas#readme"
}
'''
index = '''\
const AWS = require('aws-sdk');
exports.handler = async (event) => {
    // TODO implement
    const response = (success, reason, data) => { return { success: success, reason: reason, data: data } }
    return response(true, null, null);
};
'''

def help():
    docs = '''\
===============Help Docstring===============
Available options
    1. --init or -i
        Use this command to create new lambda for example
        >>> python setup.py -i
    2. --build or -b
        Use this command to build any particular or all lambdas at once for ex:
        >>> python setup.py -b . # for generating output for all lambdas
        >>> python setup.py -b <lambda-name>/ # for generating output of particular lambda
    3. --ls or -ls
        Use this command to list all the lambdas
    4. --help or -h
        Feel free to get a help docstring using this command
        >>> python setup.py --help
    '''
    print(docs)

def ls(path='.'):
    for item in os.listdir(path):
        if not os.path.isdir(f'{path}/{item}') or item == 'out':
            continue
        if is_lambda(f'{path}/{item}'):
            print(item)
        else:
            ls(f'{path}/{item}')

def is_lambda(path):
    # return bool if the path is a valid lambda or not
    path += '/' if path[-1] != '/' else ''
    return os.path.isdir(path) and os.path.exists(f'{path}package.json') and os.path.exists(f'{path}/index.js')

def check_for_out(path):
    # checks if path directory comtains the out folder or not
    print(path)
    path += '/' if path[-1] != '/' else ''
    if 'out' not in os.listdir(path):
        os.mkdir(f'{path}/out')

def build(path, recur=False):
    #print(path)
    path += '/' if path[-1] != '/' else ''
    if path != './' and not recur:
        if not is_lambda(path):
            print(f'Invalid!! path. {path} provided is not a valid lambda.')
        else:
            os.chdir(path)
            os.chdir('..')
            check_for_out(os.getcwd())
            os.chdir(path.split('/')[-2])
            os.system(f'echo \'> Building @{path} lambda\'')
            name = path.split('/')[-2]
            os.system(f'zip -r ../out/{name}.zip *')
            os.system('echo =============== Done! ===============')
        return

    dirs = os.listdir(path)
    for item in dirs:
        curr_path = f'{path}{item}/'
        if (not os.path.isdir(curr_path)) or item == 'out':
            continue
        if is_lambda(curr_path):
            backup = os.getcwd()
            check_for_out(path)
            os.chdir(curr_path)
            os.system(f'echo \'> Building @{path} lambda\'')
            os.system(f'zip -r ../out/{item}.zip *')
            os.system('echo =============== Done! ===============')
            os.chdir(backup)
        else:
            build(curr_path, 1)


def is_valid_name(name):
    if name == '':
        print('Project name can\'t be empty')
        return False
    for d in os.listdir('.'):
        if os.path.isdir(d) and d == name:
            print('@{} lambda already exist'.format(projectName))
            return False
    return True

def setup(projectName):
    print('Creating new @{} lambda'.format(projectName))
    global package, index
    os.mkdir(projectName)
    with open(projectName+'/index.js', 'w') as f:
        f.write(index)
    with open(projectName+'/package.json', 'w') as f:
        f.write(package)
    print(package)
    print('=============== Done! ===============')


args = sys.argv
if args[1] == '--build' or args[1] == '-b':
    build(args[-1])
    pass
elif args[1] == '--init' or args[1] == '-i':
    projectName = input('Lambda Name: ')
    projectDirectory= input('Directory path: ')
    while not os.path.isdir(projectDirectory):
        print(f'{projectDirectory} doesn\'t exist. Want to creat [Y/y]|[N/n]')
        response = input()
        if response in ['Y', 'y']:
            os.makedirs(f'./{projectDirectory}')
            continue
        print("Please provide a valid directory ")
        print()
        projectDirectory=input('Directory path: ')
    while not is_valid_name(projectName):
        projectName = input('Project Name: ')
    description = input('Description [Lambda function]: ')
    description = 'Lambda function' if description == '' else description
    package = package.replace('###', projectName)
    package = package.replace('@@@', description)
    os.chdir(projectDirectory)
    setup(projectName)

elif args[-1] == '--ls' or args[-1] == '-ls':
    ls()
elif args[-1] == '--help' or args[-1] == '-h':
    help()
else:
    print('Use --help to know how it works')
    exit(-1)
