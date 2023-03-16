import dateFormat from 'dateformat';
import { History } from 'history';
import update from 'immutability-helper';
import * as React from 'react';
import {
  Divider,
  Grid,
  Header,
  Input,
  Loader,
  Form,
  Button
} from 'semantic-ui-react';

import { createTodo, deleteTodo, getTodos, updateTodo } from '../api/todos-api';
import Auth from '../auth/Auth';
import { TodoItem } from '../types/Todo';
import TodoItemCp from '../components/TodoItem';

interface TodosProps {
  auth: Auth;
  history: History;
}


interface TodosState {
  todos: TodoItem[];
  newTodoName: string;
  loadingTodos: boolean;
  nextKey:string,
  nextKeyList: Array<any>
  limit:number,
  profile:any
}
export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true,
    nextKey:'',
    nextKeyList: [],
    limit:5,
    profile:{}
  };

  async componentDidMount() {
    try {
      const todos:any = await getTodos(this.props.auth.getIdToken(),{
        nextKey:this.state.nextKey,
        limit:this.state.limit,
      });

      const token = this.props.auth.accessToken
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions:any = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`https://dev-tkib8gnatghhblhe.us.auth0.com/userinfo`, requestOptions)
        .then(response => response.json())
        .then((result:any) => {
          this.setState({profile:result})
        })
        .catch(error => console.log('error', error));

      this.setState({
        todos:todos.todoList,
        nextKey:todos.nextKey,
        loadingTodos: false
      });
    } catch (error:any) {
      console.error(`Failed to fetch todos: ${error.message}`);
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value });
  };

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`);
  };

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate();
      const nameTodo = this.state.newTodoName
      if (!nameTodo.trim()) {
        alert("Please not empy")
        return
      }

      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate,
        attachmentUrl: ''
      });
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ''
      });
    } catch {
      alert('Todo creation failed');
    }
  };

  onTodoDelete = async (todoId: string, createdAt: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId);
      this.setState({
        todos: this.state.todos.filter((todo) => todo.todoId !== todoId)
      });
    } catch {
      alert('Todo deletion failed');
    }
  };

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos];
      await updateTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      });
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      });
    } catch {
      alert('Todo deletion failed');
    }
  };

  handleClickPrev = async () =>{
      const nextKey = this.state.nextKeyList.pop();
      this.setState({loadingTodos:true})
      const todos:any = await getTodos(this.props.auth.getIdToken(),{
        nextKey: this.state.nextKeyList.at(-1) || '',
        limit:this.state.limit,
      });
      this.setState({
        todos:todos.todoList,
        nextKey: nextKey,
        loadingTodos: false
    });
  }

  handleNextPage = async () =>{
    this.setState({loadingTodos:true})
    const todos:any = await getTodos(this.props.auth.getIdToken(),{
      nextKey:this.state.nextKey,
      limit:this.state.limit,
    });
    this.setState({
        todos:todos.todoList,
        nextKey:todos.nextKey,
        nextKeyList:[...this.state.nextKeyList,this.state.nextKey],
        loadingTodos: false
    });
  }

  render() {
    const {profile} = this.state
    console.log(this.state);
    
    return (
      <div>
        <Header as="h1">TODOs</Header>
        <Header as="h2">Hi: {profile?.name}</Header>
        
        {this.renderCreateTodoInput()}
        <Button disabled={!(this.state.nextKeyList.length>0)} onClick={this.handleClickPrev}>Previous</Button>
          {this.state.nextKeyList.length + 1 } &nbsp;
        <Button onClick={this.handleNextPage}>Next</Button>
        {this.renderTodos()}
      </div>
    );
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Field required>
            <Input
              action={{
                color: 'teal',
                labelPosition: 'left',
                icon: 'add',
                content: 'New task',
                onClick: this.onTodoCreate
              }}
              fluid
              actionPosition="left"
              placeholder="To change the world..."
              onChange={this.handleNameChange}
              value={this.state.newTodoName}

            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    );
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading();
    }

    return this.renderTodosList();
  }

  renderLoading() {
    return (
        <Loader className="fullscreen" indeterminate active inline="centered">
          Loading TODOs
        </Loader>
    );
  }

  renderTodosList() {
    return (
      <TodoItemCp
        onTodoDelete={this.onTodoDelete}
        onEditButtonClick={this.onEditButtonClick}
        onTodoCheck={this.onTodoCheck} 
        todos={this.state.todos}
      />
    );
  }

  calculateDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    return dateFormat(date, 'yyyy-mm-dd') as string;
  }
}