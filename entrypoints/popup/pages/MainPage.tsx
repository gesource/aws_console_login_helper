import React, {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import Account from "../models/Account";
import {Fab, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

interface MainPageProps {
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
}

function MainPage(accounts: MainPageProps) {
    const navigate = useNavigate();
    // 検索キーワード
    const searchKeyword = useRef<HTMLInputElement>(null);
    // 表示するアカウント一覧
    const [displayAccounts, setDisplayAccounts] = React.useState(accounts.accounts);

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
        search(accounts.accounts);
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
        const newAccounts = accounts.accounts.filter((account) => account.id !== id);
        accounts.setAccounts(newAccounts);
    };

    /**
     * 選択したアカウントの情報をサインインページに入力する
     * @param id    アカウントID
     */
    const selectAccount = (id: string) => {
        const account = accounts.accounts.find((account) => account.id === id);
        if (account === undefined) {
            return;
        }
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, {account: account})
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    };

    // アカウント一覧が更新されたら検索結果を更新する
    useEffect(() => {
        search(accounts.accounts);
    }, [accounts.accounts]);

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
        </>
    );
}

export default MainPage;