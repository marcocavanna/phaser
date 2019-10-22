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
### `counter(name, initial, state)`
This Method return a set of utility to change the counter. That counter will be   
returned while generating the status. It can be Incremented or Decremented.

#### Params
- `name`
  - **type**: `String`
  - **description**: The Name of the counter
- `initial`
  - **type**: `Number`
  - **description**: The initial value of the Counter. By default it is zero
  - **default**: `0`
- `state`
  - **type**: `String`
  - **description**: The state of the Counter. It can be 'normal', 'warning' or 'error'
  - **default**: `normal`
___
## `Phaser()`
In This section are contained all the Methods `Phaser` has got.   
It use Task and Writer to create the log in the console, but he has got    
many other usefull Methods.
___
### `constructor(description, options, parent)`
The constructor creates a new Phaser object.

#### Params
- `description`
  - **type**: `String`
  - **description**: The title of the new Phase
- `options`
  - **type**: `Object`
  - **description**: Some options for the Phase
  - `autoStart`
    - **type**: `Boolean`
    - **description**: If it is 'true' the Phase will start automatically, otherwise it requires to call the `start()` Method
    - **default**: `false`
- `parent`
  - **type**: `Class`
  - **description**: The Phase class to attach the new Phase
___
### `child(description, options)`
This Method return a new Phase Object attached to the main Phase parent    
and called with the correct parameter. This will be a subPhase.

#### Params
- `description`
  - **type**: `String`
  - **description**: The description of the new Phase
- `options`
  - **type**: `Object`
  - **description**: Some options for the Phase
___
### `task(name, exec, options)`
This Method return a new `Task` Object, called with the correct parameters return   
a new task in the final log.

#### Params
- `name`
  - **type**: `string`
  - **description**: The name of the Task
- `exec`
  - **type**: `Function`
  - **description**: This is the Promise Function; the Task will return the result of this Promise Function.
  - `task`
    - **type**: `Class`
    - **description**: The task to append to
    - **default**: `this.task`
  - `phaser`
    - **type**: `Class`
    - **description**: The Phaser which is the parent of the Task
    - **default**: `this.phaser`
- `options`
  - **type**: `Object`
  - **description**: Some options for the new Task
  - `silent`
    - **type**: `Boolean`
    - **description**: If it is setted as 'true', it will does not show the start or end message in the log
___





