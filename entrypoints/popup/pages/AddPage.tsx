import React, {useRef} from "react";
import Account from "../models/Account";
import {useNavigate, useParams} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {AppBar, Button, IconButton, TextField, Toolbar, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import background from "@/entrypoints/background";


interface AddPageProps {
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
}

function AddPage(accounts: AddPageProps) {
    const params = useParams();
    const navigate = useNavigate();

    const targetAccountId = params.id;
    const account = accounts.accounts.find((account) => account.id === targetAccountId) || new Account("", "", "", "", "", "");

    const accountName = useRef<HTMLInputElement>(null);
    const accountId = useRef<HTMLInputElement>(null);
    const userName = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const backgroundColor = useRef<HTMLInputElement>(null);
    const textColor = useRef<HTMLInputElement>(null);

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newAccountName = accountName.current?.value || "";
        const newAccountId = accountId.current?.value || "";
        const newUserName = userName.current?.value || "";
        const newPassword = password.current?.value || "";
        const newBackgroundColor = backgroundColor.current?.value || "";
        const newTextcolor = textColor.current?.value || "";

        // 必須項目が入力されていることを確認する
        if (!newAccountName) {
            alert("アカウント名を入力してください");
            return
        }
        if (!newAccountId) {
            alert("アカウントIDを入力してください");
            return
        }
        // idの重複チェック
        if (targetAccountId !== newAccountId && accounts.accounts.some((account) => account.id === newAccountId)) {
            alert("アカウントIDが重複しています");
            return
        }

        // 新規作成のとき
        if (!targetAccountId) {
            console.log("新規作成");
            const account = new Account(newAccountName, newAccountId, newUserName, newPassword, newBackgroundColor, newTextcolor);
            accounts.setAccounts([...accounts.accounts, account]);
            goToMainPage();
            return;
        }
        // 変更のとき
        const newAccounts = accounts.accounts.map((account) => {
            if (account.id === targetAccountId) {
                return new Account(newAccountName, newAccountId, newUserName, newPassword, newBackgroundColor, newTextcolor);
            }
            return account;
        });
        accounts.setAccounts(newAccounts);
        goToMainPage();
    }

    const goToMainPage = () => {
        navigate("/");
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
                                    inputRef={accountName}
                                    defaultValue={account.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="accountId"
                                    label="アカウントID"
                                    name="accountId"
                                    inputRef={accountId}
                                    defaultValue={account.id}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="userName"
                                    label="ユーザー名"
                                    name="userName"
                                    inputRef={userName}
                                    defaultValue={account.userName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="password"
                                    label="パスワード"
                                    name="password"
                                    type="password"
                                    inputRef={password}
                                    defaultValue={account.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="backGroundColor"
                                    label="ラベルの背景色"
                                    name="backGroundColor"
                                    type="color"
                                    inputRef={backgroundColor}
                                    defaultValue={account.backgroundColor}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="accountId"
                                    label="ラベルの文字色"
                                    name="textColor"
                                    type="color"
                                    inputRef={textColor}
                                    defaultValue={account.textColor}
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
        </>
    );
}

export default AddPage;
