
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { PlusCircleOutlined } from "@ant-design/icons";
import { ButtonGroup, Grid, IconButton, Stack, Typography } from "@mui/material";
import { RichTreeView, TreeViewBaseItem } from "@mui/x-tree-view";
import { useContext, useEffect, useState } from "react";
import { RefreshContext } from "../../../components/contexts/RefreshContext";
import { EpicCard } from "./EpicCard";
import EpicDialog from "./EpicDialog";
import { FeatureCard } from "./FeatureCard";
import { ProjectContext } from "./ProjectContext";
import { StoryCard } from "./StoryCard";
import { TaskCard } from "./TaskCard";



const ItemDetail = (props: { item: any }) => {
    if (props.item) {
        switch (props.item.type) {
            case 'epic':
                return <EpicCard epic={props.item.element} />
            case 'feature':
                return <FeatureCard feature={props.item.element} />
            case 'story':
                return <StoryCard story={props.item.element} />
            case 'task':
                return <TaskCard task={props.item.element} />
            default:
                return <Typography>Make a selection</Typography>
        }
    }
    return <Typography>Make a selection</Typography>
}

export const EpicPanel = () => {
    const { refresh } = useContext(RefreshContext);
    const { project } = useContext(ProjectContext);
    
    const [items, setItems] = useState<TreeViewBaseItem[]>([]);
    const [showEpicDialog, setShowEpicDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>();

    useEffect(() => {
        if (project) {
            setItems(project.epics
                .map((e, edx) => {
                    return {
                        airtableId: `${e.id}`,
                        id: `${edx}`,
                        label: `Epic: ${e.name}`,
                        element: e,
                        type: 'epic',
                        children: e.features && e.features.map((f, fdx) => {
                            return {
                                airtableId: `${f.id}`,
                                id: `${edx}.${fdx}`,
                                label: `Feature: ${f.name}`,
                                element: f,
                                type: 'feature',
                                children: f.stories && f.stories.map((story, sdx) => {
                                    return {
                                        airtableId: `${story.id}`,
                                        id: `${edx}.${fdx}.${sdx}`,
                                        label: `Story: ${story.name}`,
                                        element: story,
                                        type: 'story',
                                        children: story.tasks && story.tasks.map((task, tdx) => {
                                            return {
                                                airtableId: `${task.id}`,
                                                id: `${edx}.${fdx}.${sdx}.${tdx}`,
                                                label: `Task: ${task.name}`,
                                                element: task,
                                                type: 'task'
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }))
        }
    }, [project, refresh])

    const findItem = (itemId: string, items: any[]): any => {
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === itemId) {
                    return items[i]
                } else {
                    const found = findItem(itemId, items[i].children)
                    if (found) {
                        return found
                    }
                }
            }
        }
        return undefined
    }

    const handleItemSelectionToggle = (
        _event: React.SyntheticEvent,
        itemId: string,
        isSelected: boolean,
    ) => {
        if (isSelected) {
            setSelected(findItem(itemId, items));
        } else {
            setSelected(undefined);
        }
    };

    // const addEpic = () => {
    //     // Validate epic number?
    //     const epic = {
    //         "Epic Name": "New Epic",
    //         "Epic Number": 1,
    //         "Status": "Not Started",
    //         "Project": [project.id],
    //         "Description": "map visualization for past hospitals",
    //     }
    //     projectService.addEpic(epic)
    //         .then(e => {
    //             console.log(e)
    //             setRefresh(0)
    //         })
    // };

    return (
        <>
            <Stack gap={1}>
                <ButtonGroup>
                    <IconButton
                        disableRipple
                        color="secondary"
                        onClick={() => setShowEpicDialog(true)}>
                        <PlusCircleOutlined />
                    </IconButton>
                </ButtonGroup>
                <Grid container gap={1}>
                    <Grid item lg={5}>
                        {project && project.epics.length === 0 &&
                            <Typography fontWeight={800}>No epics found.</Typography>
                        }
                        {project && project.epics.length > 0 &&
                            <RichTreeView
                                items={items}
                                onItemSelectionToggle={handleItemSelectionToggle} />
                        }
                    </Grid>
                    <Grid item lg={6}>
                        <ItemDetail item={selected} />
                    </Grid>
                </Grid>
            </Stack>
            <EpicDialog
                project={project!}
                open={showEpicDialog}
                handleSuccess={function (resp: any | null): void {
                    if (resp) {
                        throw new Error("Function not implemented.");
                    }
                    setShowEpicDialog(false)
                }}
                handleError={function (err: Error): void {
                    console.error(err)
                    setShowEpicDialog(false)
                    throw new Error("Function not implemented.");
                }} />
        </>
    )
};
