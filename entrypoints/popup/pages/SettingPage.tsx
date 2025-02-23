import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from "react";
import Account from "../models/Account.ts";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";

interface SettingPageProps {
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
}

function SettingPage(props: SettingPageProps) {
    const navigate = useNavigate();
    const importSettingsRef = React.useRef<HTMLInputElement>(null);
    const [openImportDialog, setOpenImportDialog] = React.useState(false);

    const goToMainPage = () => {
        navigate("/");
    }

    /**
     * 設定をクリップボードにコピーする
     */
    const exportSettings = () => {
        navigator.permissions.query({name: "clipboard-write" as PermissionName})
            .then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    const settings = JSON.stringify(props.accounts);
                    navigator.clipboard.writeText(settings).then(() => {
                            alert("設定をクリップボードにコピーしました。");
                        }
                    )
                }
            })
    }

    /**
     * 設定をインポートする
     */
    const importSettings = () => {
        if (!importSettingsRef.current) {
            return;
        }
        try {
            const json = JSON.parse(importSettingsRef.current.value);
            const accounts = json as Account[];
            props.setAccounts(accounts);
            alert("インポートしました。")
        } catch (e) {
            alert(e);
        }
    }

    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="戻る"
                            sx={{mr: 2}}
                            onClick={goToMainPage}
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{flexGrow: 1}}
                        >
                            インポート・エクスポート
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem
                        secondaryAction={
                            <Button
                                variant="contained"
                                startIcon={<UploadIcon/>}
                                onClick={() => setOpenImportDialog(true)}
                            >
                                インポート
                            </Button>
                        }
                    >
                        <ListItemText primary="インポート" secondary="設定をインポートする"/>
                    </ListItem>
                    <ListItem
                        secondaryAction={
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon/>}
                                onClick={exportSettings}
                            >
                                エクスポート
                            </Button>
                        }
                    >
                        <ListItemText primary="エクスポート" secondary="設定をコピーします。"/>
                    </ListItem>
                </List>
            </Box>
            <Dialog
                fullScreen
                open={openImportDialog}
                onClose={() => setOpenImportDialog(false)}
            >
                <DialogContent>
                    <TextField
                        label="JSONを貼り付けてください"
                        fullWidth
                        multiline
                        minRows={4}
                        inputRef={importSettingsRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={importSettings}>
                        インポート
                    </Button>
                    <Button onClick={() => setOpenImportDialog(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SettingPage;
