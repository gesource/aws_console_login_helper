import React, {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import type {Account} from "@/utils/account";
import {sendLogin} from "@/utils/messaging";
import {useAccounts} from "../hooks/useAccounts";
import {useSnackbar} from "../hooks/useSnackbar";
import {Fab, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

function MainPage() {
    const navigate = useNavigate();
    const {accounts, setAccounts} = useAccounts();
    const {showMessage, snackbar} = useSnackbar();
    // 検索キーワード
    const searchKeyword = useRef<HTMLInputElement>(null);
    // 表示するアカウント一覧
    const [displayAccounts, setDisplayAccounts] = React.useState<Account[]>(accounts);

    /**
     * 新規追加ページを開く
     */
    const goToAddPage = () => {
        navigate("/add");
    }

    const goToSettingPage = () => {
        navigate("/setting");
    }

    /**
     * サインインページを開く
     */
    const goToAwsConsole = () => {
        chrome.tabs.create({url: "https://console.aws.amazon.com/"});
    }

    /**
     * 入力されたキーワードをアカウント名に含むアカウントを表示する
     * @param accounts
     */
    const search = (accounts: Account[]) => {
        const keyword = searchKeyword.current?.value || "";
        if (keyword === "") {
            setDisplayAccounts(accounts);
            return;
        }
        const filteredAccounts = accounts.filter((account) => {
            return account.name.includes(keyword);
        })
        setDisplayAccounts(filteredAccounts);
    };

    const searchAccounts = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        search(accounts);
    }

    /**
     * 編集ページを開く
     * @param id    編集するアカウントのアカウントID
     */
    const editAccount = (id: string) => {
        navigate(`/edit/${id}`);
    };

    /**
     * アカウントを削除する
     * @param id    削除するアカウントのアカウントID
     */
    const deleteAccount = (id: string) => {
        const newAccounts = accounts.filter((account) => account.id !== id);
        setAccounts(newAccounts);
    };

    /**
     * 選択したアカウントの情報をサインインページに入力する
     * @param id    アカウントID
     */
    const selectAccount = (id: string) => {
        const account = accounts.find((account) => account.id === id);
        if (account === undefined) {
            return;
        }
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const tabId = tabs[0]?.id;
            if (tabId === undefined) {
                showMessage("アクティブなタブが見つかりませんでした", "error");
                return;
            }
            sendLogin(tabId, account)
                .then((result) => {
                    if (!result.ok) {
                        showMessage(`入力に失敗しました: ${result.reason}`, "error");
                    }
                })
                .catch(() => {
                    showMessage("このページには入力できませんでした", "error");
                });
        });
    };

    // アカウント一覧が更新されたら検索結果を更新する
    useEffect(() => {
        search(accounts);
    }, [accounts]);

    return (
        <>
            <Box sx={{margin: "10px"}}>
                <Stack
                    direction="row"
                    component="form"
                    onSubmit={event => searchAccounts(event)}
                    sx={{padding: "8px 16px"}}>
                    <TextField
                        label="検索"
                        variant="outlined"
                        inputRef={searchKeyword}
                        size="small"
                        sx={{width: "100%"}}
                    />
                    <IconButton
                        aria-label="検索"
                        color="primary"
                        type="submit"
                    >
                        <SearchIcon/>
                    </IconButton>
                    <IconButton
                        aria-label="設定"
                        onClick={goToSettingPage}
                    >
                        <SettingsIcon/>
                    </IconButton>
                    <IconButton
                        aria-label="ログイン画面"
                        onClick={goToAwsConsole}
                    >
                        <HomeIcon/>
                    </IconButton>
                </Stack>
                <List
                >
                    {displayAccounts.map((account) => (
                        <ListItem
                            key={account.id}
                            divider={true}
                        >
                            {/* アカウントの背景色を示すボックス */}
                            <Box sx={{
                                width: 16,
                                height: 32,
                                backgroundColor: account.backgroundColor,}}>
                            </Box>
                            <ListItemButton>
                                <ListItemText
                                    primary={account.name}
                                    secondary={`${account.id} / ${account.userName}`}
                                    onClick={() => selectAccount(account.id)}
                                />
                                <IconButton
                                    onClick={() => editAccount(account.id)}
                                >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={() => deleteAccount(account.id)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Fab
                    aria-label="追加"
                    color="primary"
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                    }}
                    onClick={goToAddPage}
                >
                    <AddIcon/>
                </Fab>
            </Box>
            {snackbar}
        </>
    );
}

export default MainPage;
