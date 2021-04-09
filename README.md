# VT-lambdas
Repository for AWS Lambda scripts

## How to use setup.py for managing lambdas
* Each lambda reside in a separate folder which is a node project hence we are using python script to create, build and list the lambdas.
* Location: [lambdas/setup.py](/lambdas/setup.py)
* Requirements
  * Terminal/Command promt
  * Python 3.x
  * python added as a path variable. To check run command `python --version`
* Run `python setupy.py`
* Available options
  * `--help` or `-h`: returns the docstring describing the available options and their arguments.
  * `--init` or `-i`: creates new lambda by taking various input form user.
  * `--build` or `-b`:
    * build and generate the artifact as `[lambda-name].zip` in `../out` directory.
    * Pass `.` as argument to build all the lambdas or specific path to build a single lambda.
    * Example `python setup.py -b .` or `python setup.py -b user_access_patterns/lambda_for_createUser`
  * `--ls` or `-ls`: lists all the lambdas available/created.
