import os
import sys

package ='''{
  "name": "__NAME__",
  "version": "1.0.0",
  "description": "__DESCRIPTION__",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "start": "zip -r ../out/###.zip *"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/code-gambit/VT-lambdas"
  },
  "author": "__AUTHOR__",
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
authors = ['Lakshya Bansal <https://github.com/lakshya-20>',
'Chhavi Tuteja <https://github.com/chhavituteja>',
'Ayush Tiwari <https://github.com/ayush0x00>',
'Danish Jamal <https://github.com/danishjamal104>'
]

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


def is_valid_name(path, name):
    if name == '':
        print('Project name can\'t be empty')
        return False
    for d in os.listdir(path):
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

def get_default_author():
    try:
        f = open('info.txt', 'r')
        return int(f.read().strip())
    except:
        f = open('info.txt', 'w')
        f.write('2')
        f.close()
        return 2

def update_default_author(author):
    print('update author')
    author = str(author)
    with open('info.txt', 'w') as f:
        f.write(author)

def author_prompt():
    default = ['']*4
    cd = get_default_author() # current default author
    default[cd] = '[default]'
    options = '''\

\t\t\tAuthors\t\t\t
----------------------------------------------------------
  1 | {} {}
----------------------------------------------------------
  2 | {} {}
----------------------------------------------------------
  3 | {} {}
----------------------------------------------------------
  4 | {} {}
----------------------------------------------------------

Enter 1/2/3/4 to choose above option or press enter to go with default

    '''.format(authors[0],default[0],
    authors[1],default[1],
    authors[2],default[2],
    authors[3],default[3])
    print(options)
    inp = input('Select author[1/2/3/4]: ').strip()
    while inp not in [str(i) for i in range(1,5)]+['']:
        print('Invalid input!! Enter values among 1, 2, 3, 4 for respective options')
        inp = input('Select author[1/2/3/4]: ').strip()
    inp = cd if inp == '' else int(inp)-1
    if inp != cd:
        update_default_author(inp)
    return authors[inp]

args = sys.argv
if args[1] == '--build' or args[1] == '-b':
    build(args[-1])
    pass
elif args[1] == '--init' or args[1] == '-i':
    projectName = input('Lambda Name: ')
    projectDirectory= input('Directory path[default: ./]: ').strip()
    if projectDirectory in ['','/']:
        projectDirectory = './'
    while not os.path.isdir(projectDirectory):
        print(f'{projectDirectory} doesn\'t exist. Want to create it [Y/y]|[N/n]')
        response = input()
        if response in ['Y', 'y']:
            os.makedirs(f'./{projectDirectory}')
            continue
        print("Please provide a valid directory ")
        print()
        projectDirectory=input('Directory path: ')
    while not is_valid_name(projectDirectory, projectName):
        projectName = input('Lambda Name: ')
    description = input('Description [Lambda function]: ')
    description = 'Lambda function' if description == '' else description
    author = author_prompt()
    package = package.replace('__NAME__', projectName)
    package = package.replace('__DESCRIPTION__', description)
    package = package.replace('__AUTHOR__', author)
    os.chdir(projectDirectory)
    setup(projectName)

elif args[-1] == '--ls' or args[-1] == '-ls':
    ls()
elif args[-1] == '--help' or args[-1] == '-h':
    help()
else:
    print('Use --help to know how it works')
    exit(-1)
