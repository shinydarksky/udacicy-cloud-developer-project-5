import { useState, useMemo } from 'react';
import { Button, Checkbox, Divider, Grid, Icon, Image } from 'semantic-ui-react';
import ModalConfirm from './ModalConfirm';
import {

    useLocation
} from "react-router-dom";

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function TodoItem({ todos, onTodoDelete, onEditButtonClick, onTodoCheck }: any) {
    const [openConfirm, setOpenConfirm] = useState(false)
    const [deleteItem, setDeleteItem] = useState<{ id?: string, createdAt?: string }>({})

    let query = useQuery();
    let searchQuery = query.get('search')



    function onClickDelete(id: any, createdAt: any) {
        setOpenConfirm(true)
        setDeleteItem({ id, createdAt })
    }

    const searchFilter = (todo: any) => {

        if (searchQuery && searchQuery?.trim().length <= 0 || !searchQuery) return todo
        else {
            const nameSearch = todo.name.toLowerCase()
            const searchString = searchQuery.toLowerCase()
            return nameSearch.search(searchString) >= 0
        }
    }

    return (
        <>
            <ModalConfirm
                isOpen={openConfirm}
                onClose={() => {
                    setOpenConfirm(false)
                    setDeleteItem({})
                }}
                onConfirm={() => {
                    setDeleteItem({})
                    setOpenConfirm(false)
                    onTodoDelete(deleteItem.id, deleteItem.createdAt)
                }}
            />
            <Grid padded>
                {todos.filter(searchFilter).map((todo: any, pos: any) => {

                    return (
                        <Grid.Row key={todo.todoId}>
                            <Grid.Column width={1} verticalAlign="middle">
                                <Checkbox onChange={() => onTodoCheck(pos)} checked={todo.done} />
                            </Grid.Column>
                            <Grid.Column width={10} verticalAlign="middle">
                                {todo.name}
                                {todo.attachmentUrl && 
                                    <Image
                                        className='image-todo is-desktop'
                                        src={todo.attachmentUrl}
                                        size="small"
                                        wrapped 

                                 />}
                            </Grid.Column>
                            <Grid.Column width={3} floated="right">
                                {todo.dueDate}
                            </Grid.Column>
                            <Grid.Column width={1} floated="right">
                                <Button icon color="blue" onClick={() => onEditButtonClick(todo.todoId)}>
                                    <Icon name="pencil" />
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={1} floated="right">
                                <Button
                                    icon
                                    color="red"
                                    onClick={() => onClickDelete(todo.todoId, todo.createdAt)}
                                >
                                    <Icon name="delete" />
                                </Button>
                            </Grid.Column>
                            {todo.attachmentUrl && <Image className='image-todo is-mobile' src={todo.attachmentUrl} size="small" wrapped />}
                            <Grid.Column width={16}>
                                <Divider />
                            </Grid.Column>
                        </Grid.Row>
                    );
                })}
            </Grid>
        </>
    )
}