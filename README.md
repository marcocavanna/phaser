# appBuckets - `Phaser`

### Description
`Phaser` is a npm Module which allows you to create a log of all the actions you want.
You can create some phases wtih an header title, which can cointain some subphases and tasks.   
It allows you to create an error messagge if the task's promise is rejected;   
A warning messagge or a complete messagge in case of success.
Go ahead to see the fully documentation.
___
## `Task()`
This is the class `Phaser` takes to create a Task.
It has a constructor function and some other Method.
___
### `constructor(name, action, option)`
The constructor is called with 3 parameters. Usually you can set only the first two.   
When you set the Function action, the task wait the return state to continue the Log.  

#### Params
- `name`
  - **type**: `string`
  - **description**: The name you want to assign at the Task
- `action`
  - **type**: `Function`
  - **description**: It is the function you want to execute and log its result. It can be a Promise or a normal function. 
___
### `complete(result)`
If a Task is returned with the `complete()` Method it means that it is successfully completed.
You can pass as `result` parameter the result of the action.   
This Method sets the status as 'Complete' and change the icon   with the 'completed icon'.

#### Params
- `result`
  - **type**: `any`
  - **description**: You can pass as result the returned value of the action Function from the task constructor.
___
### `error(err)`
If a Task is returned with the `error()` Method it means that an error is occurred.    
You can pass as parameter a string to describe the Error.

#### Params
- `err`
  - **type**: `String`
  - **description**: This string is displayed in the Log as a description of the Error
  - **default**: `Generic Error`
___
### `warning(warn)`
If a Task is returned with the `warning()` Method it means that a warning is occurred.   
The Task is still successfully completed but a warning is displayed.
#### Params
- `warn`
  - **type**: `Boolean`
  - **description**: If it's 'true' the warning is saved in the tasks Array.
___
### `fatal(err)`
If a Task is returned with the `fatal()` Method it means that a fatal error is occurred.   
You can pass as parameter a string to describe the Error.

#### Params
- `err`
  - **type**: `String`
  - **description**: This string is displayed in the Log as a description of the Error
  - **default**: `Generic Error`
___




