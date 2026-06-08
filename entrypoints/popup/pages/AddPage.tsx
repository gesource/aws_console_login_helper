import React, {useState} from "react";
import {type Account, createAccount} from "@/utils/account";
import {useAccounts} from "../hooks/useAccounts";
import {useNavigate, useParams} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {AppBar, Button, IconButton, TextField, Toolbar, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AddPage() {
    const {accounts, loading, setAccounts} = useAccounts();

    // storage の読み込み完了まではフォームを描画しない
    // （編集時に初期値を正しく反映するため）
    if (loading) {
        return null;
    }
    return <AddPageForm accounts={accounts} setAccounts={setAccounts}/>;
}

interface AddPageFormProps {
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
}

function AddPageForm({accounts, setAccounts}: AddPageFormProps) {
    const params = useParams();
    const navigate = useNavigate();

    const targetAccountId = params.id;
    const account = accounts.find((account) => account.id === targetAccountId) ?? createAccount();

    const [name, setName] = useState(account.name);
    const [id, setId] = useState(account.id);
    const [userName, setUserName] = useState(account.userName);
    const [password, setPassword] = useState(account.password);
    const [backgroundColor, setBackgroundColor] = useState(account.backgroundColor || "#000000");
    const [textColor, setTextColor] = useState(account.textColor || "#ffffff");

    const [nameError, setNameError] = useState("");
    const [idError, setIdError] = useState("");

    const goToMainPage = () => {
        navigate("/");
    }

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // バリデーション
        let valid = true;
        if (!name) {
            setNameError("アカウント名を入力してください");
            valid = false;
        }
        if (!id) {
            setIdError("アカウントIDを入力してください");
            valid = false;
        } else if (targetAccountId !== id && accounts.some((account) => account.id === id)) {
            setIdError("アカウントIDが重複しています");
            valid = false;
        }
        if (!valid) {
            return;
        }

        const newAccount = createAccount({name, id, userName, password, backgroundColor, textColor});

        // 新規作成のとき
        if (!targetAccountId) {
            setAccounts([...accounts, newAccount]);
            goToMainPage();
            return;
        }
        // 変更のとき
        const newAccounts = accounts.map((account) =>
            account.id === targetAccountId ? newAccount : account,
        );
        setAccounts(newAccounts);
        goToMainPage();
    }

    return (
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
                        {targetAccountId ? "アカウント編集" : "アカウント追加"}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="xs">
                <Box component="form" noValidate onSubmit={event => save(event)} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="accountName"
                                label="アカウント名"
                                name="accountName"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameError("");
                                }}
                                error={!!nameError}
                                helperText={nameError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="accountId"
                                label="アカウントID"
                                name="accountId"
                                value={id}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    setIdError("");
                                }}
                                error={!!idError}
                                helperText={idError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="userName"
                                label="ユーザー名"
                                name="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="password"
                                label="パスワード"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="backGroundColor"
                                label="ラベルの背景色"
                                name="backGroundColor"
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="textColor"
                                label="ラベルの文字色"
                                name="textColor"
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        登録する
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default AddPage;
