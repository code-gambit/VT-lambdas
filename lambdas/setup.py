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

def ls():
    c = 0
    for item in os.listdir('.'):
        if os.path.isdir(item):
            if os.path.exists('{}/package.json'.format(item)):
                c += 1
                print(item)
    if c==0:
        print('No lambdas created yet.')

def build(scope):
    any = -1
    scope = scope.replace('/','')
    dirs = os.listdir('.')
    for item in dirs:
        if os.path.isdir(item) and item != 'out':
            os.chdir(item)
            if scope == '.' or item == scope:
                any = 1
                os.system('echo \'> Building @{} lambda\''.format(item))
                os.system('npm start')
                os.system('echo =============== Done! ===============')
            os.chdir('..')
    if any == -1:
        if scope == '.':
            print('No lambda exist')
            return
        print('No @{} lambda exist'.format(scope))

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
