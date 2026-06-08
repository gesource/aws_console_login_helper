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
import type {Account} from "@/utils/account";
import {useAccounts} from "../hooks/useAccounts";
import {useSnackbar} from "../hooks/useSnackbar";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";

function SettingPage() {
    const navigate = useNavigate();
    const {accounts, setAccounts} = useAccounts();
    const {showMessage, snackbar} = useSnackbar();
    const importSettingsRef = React.useRef<HTMLInputElement>(null);
    const [openImportDialog, setOpenImportDialog] = React.useState(false);

    const goToMainPage = () => {
        navigate("/");
    }

    /**
     * 設定をクリップボードにコピーする
     */
    const exportSettings = async () => {
        try {
            const settings = JSON.stringify(accounts);
            await navigator.clipboard.writeText(settings);
            showMessage("設定をクリップボードにコピーしました", "success");
        } catch {
            showMessage("クリップボードへのコピーに失敗しました", "error");
        }
    }

    /**
     * 設定をインポートする
     */
    const importSettings = () => {
        if (!importSettingsRef.current) {
            return;
        }
        try {
            const accounts = JSON.parse(importSettingsRef.current.value) as Account[];
            setAccounts(accounts);
            setOpenImportDialog(false);
            showMessage("インポートしました", "success");
        } catch {
            showMessage("JSONの形式が正しくありません", "error");
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
                        <ListItemText primary="エクスポート" secondary="設定をコピーします。パスワードは平文で出力されます。"/>
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
            {snackbar}
        </>
    );
}

export default SettingPage;
