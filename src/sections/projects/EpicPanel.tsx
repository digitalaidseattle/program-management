
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { ButtonGroup, IconButton, Stack, Typography } from "@mui/material";
import { RichTreeView, TreeViewBaseItem } from "@mui/x-tree-view";
import { useContext, useEffect, useState } from "react";
import { ventureService, VentureProps } from "../../services/dasVentureService";
import { PlusCircleOutlined } from "@ant-design/icons";
import { RefreshContext } from "../../components/contexts/RefreshContext";
import EpicDialog from "./EpicDialog";


export const EpicPanel: React.FC<VentureProps> = ({ venture }) => {
    const { refresh } = useContext(RefreshContext);
    const [items, setItems] = useState<TreeViewBaseItem[]>([]);
    const [showEpicDialog, setShowEpicDialog] = useState<boolean>(false);

    useEffect(() => {
        if (venture) {
            setItems(venture.epics
                .map((e: any, edx: number) => {
                    return {
                        airtableId: `${e.id}`,
                        id: `${edx}`,
                        label: `${e.name}`,
                        children: e.features
                            .map((f: any, fdx: number) => {
                                return {
                                    airtableId: `${f.id}`,
                                    id: `${edx}.${fdx}`,
                                    label: `${f.name}`,
                                    children: f.stories
                                        .map((s: any, sdx: number) => {
                                            return {
                                                airtableId: `${s.id}`,
                                                id: `${edx}.${fdx}.${sdx}`,
                                                label: `${s.name}`,
                                                children: s.tasks
                                                    .map((t: any, tdx: number) => {
                                                        return {
                                                            airtableId: `${s.id}`,
                                                            id: `${edx}.${fdx}.${sdx}.${tdx}`,
                                                            label: `${t.name}`,
                                                        }
                                                    })
                                            }
                                        })
                                }
                            })
                    }
                }))
        }
    }, [venture, refresh])

    const handleItemSelectionToggle = (
        event: React.SyntheticEvent,
        itemId: string,
        isSelected: boolean,
    ) => {
        if (isSelected) {
            console.log(event, itemId)
            const coord = itemId.split('.');
            const epic = venture.epics[Number(coord[0])];
            epic.features.forEach(async (f: any) => {
                f.stories = ventureService.getStories(f);
            })
            console.log(epic)
            // setLastSelectedItem(itemId);
        }
    };

    // const addEpic = () => {
    //     // Validate epic number?
    //     const epic = {
    //         "Epic Name": "New Epic",
    //         "Epic Number": 1,
    //         "Status": "Not Started",
    //         "Project": [venture.id],
    //         "Description": "map visualization for past hospitals",
    //     }
    //     ventureService.addEpic(epic)
    //         .then(e => {
    //             console.log(e)
    //             setRefresh(0)
    //         })
    // };

    return (
        <>
            <Stack gap={'0.5rem'}>
                <ButtonGroup>
                    <IconButton
                        disableRipple
                        color="secondary"
                        onClick={() => setShowEpicDialog(true)}>
                        <PlusCircleOutlined />
                    </IconButton>
                </ButtonGroup>
                {venture && venture.epics.length === 0 && <Typography fontWeight={800}>No epics found.</Typography>}
                {venture && venture.epics.length > 0 && <RichTreeView items={items} onItemSelectionToggle={handleItemSelectionToggle} />}
            </Stack>
            <EpicDialog
                venture={venture}
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
