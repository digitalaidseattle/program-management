
import {
    closestCorners,
    defaultDropAnimation,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Card, CardContent } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import SortableItem from '../../components/SortableItem';
import { SprintProps } from '../../services/dasVentureService';
import { pmTaskService } from '../../services/pmTaskService';

export const STATUSES = [
    "Not Started",
    "In Progress",
    "Completed",
    "Paused",
    // byDesign: "By Design",
    //readyForQA: "Ready for QA"
];
type TaskProps = {
    task: any;
};

const TaskCard: React.FC<TaskProps> = ({ task }) => {
    return (
        <Card>
            <CardContent>Name: {task.name}</CardContent>
        </Card>
    );
};

type BoardSectionProps = {
    id: string;
    title: string;
    tasks: any[];
};
const BoardSection = ({ id, title, tasks }: BoardSectionProps) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <Box sx={{ backgroundColor: '#eee', padding: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {title}
            </Typography>
            <SortableContext
                id={id}
                items={tasks}
                strategy={verticalListSortingStrategy}
            >
                <Container ref={setNodeRef}>
                    {tasks.map((task) => (
                        <Box key={task.id} sx={{ mb: 2 }}>
                            <SortableItem id={task.id}>
                                <TaskCard task={task} />
                            </SortableItem>
                        </Box>
                    ))}
                </Container>
            </SortableContext>
        </Box>
    );
};

const SprintBoard: React.FC<SprintProps> = ({ sprint }) => {
    // const { user } = useContext(UserContext);
    const [tasks, setTasks] = useState<any[]>([]);
    const [activeTask, setActiveTask] = useState<any>();
    // const [changes, setChanges] = useState<Record<string, unknown>>({});

    useEffect(() => {
        if (sprint) {
            Promise.all(sprint.taskIds.map((t: string) => pmTaskService.getById(t)))
                .then(resps => setTasks(resps))
        }
    }, [sprint]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = ({ active }: DragStartEvent) => {
        if (active) {
            setActiveTask(tasks.find(t => t.id === active.id as string))
        }
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        console.log(active, over)
        // Find the containers
        // const activeContainer = findBoardSectionContainer(
        //     boardSections!,
        //     active.id as number
        // );
        // const overContainer = findBoardSectionContainer(
        //     boardSections!,
        //     over?.id as number
        // );

        // if (
        //     !activeContainer ||
        //     !overContainer ||
        //     activeContainer === overContainer
        // ) {
        //     return;
        // }


        // setBoardSections((boardSection) => {
        //     const activeItems = boardSection![activeContainer];
        //     const overItems = boardSection![overContainer];

        //     // Find the indexes for the items
        //     const activeIndex = activeItems.findIndex(
        //         (item: any) => item.id === active.id
        //     );
        //     const overIndex = overItems.findIndex((item: any) => item.id !== over?.id);

        //     return {
        //         ...boardSection,
        //         [activeContainer]: [
        //             ...boardSection![activeContainer].filter(
        //                 (item: any) => item.id !== active.id
        //             ),
        //         ],
        //         [overContainer]: [
        //             ...boardSection![overContainer].slice(0, overIndex),
        //             boardSections![activeContainer][activeIndex],
        //             ...boardSection![overContainer].slice(
        //                 overIndex,
        //                 boardSection![overContainer].length
        //             ),
        //         ],
        //     };
        // });

    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        console.log(active, over)
        // const activeContainer = findBoardSectionContainer(
        //     boardSections!,
        //     active.id as number
        // );
        // const overContainer = findBoardSectionContainer(
        //     boardSections!,
        //     over?.id as number
        // );


        // if (
        //     !activeContainer ||
        //     !overContainer ||
        //     activeContainer !== overContainer
        // ) {
        //     return;
        // }

        // const activeIndex = boardSections![activeContainer].findIndex(
        //     (ticket) => ticket.id === active.id
        // );
        // const overIndex = boardSections![overContainer].findIndex(
        //     (ticket) => ticket.id === over?.id
        // );

        // if (activeIndex !== overIndex) {
        //     setBoardSections((boardSection) => ({
        //         ...boardSection,
        //         [overContainer]: arrayMove(
        //             boardSection![overContainer],
        //             activeIndex,
        //             overIndex
        //         ),
        //     }));
        // }
        // // persist status changes in database
        // changes["status"] = active.data.current?.sortable.containerId;
        // setChanges({ ...changes });
        // ticketService.updateTicket(user!, ticket!, changes)
        //     .then(() => {
        //         setChanges({});
        //     })

        // setActiveTask(undefined);
    };

    const dropAnimation: DropAnimation = {
        ...defaultDropAnimation,
    };

    return (
        <Container>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Grid container spacing={4}>
                    {STATUSES.map((key) => (
                        <Grid item xs={3} key={key}>
                            <BoardSection
                                id={key}
                                title={key}
                                tasks={tasks.filter(t => t.status === key)}
                            />
                        </Grid>
                    ))}
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeTask ? <TaskCard task={activeTask} /> : null}
                    </DragOverlay>
                </Grid>
            </DndContext>
        </Container>
    );
};

export default SprintBoard;
