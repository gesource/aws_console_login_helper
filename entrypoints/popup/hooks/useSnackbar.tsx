import React, { useCallback, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

type Severity = "success" | "error" | "info" | "warning";

interface SnackbarState {
    open: boolean;
    message: string;
    severity: Severity;
}

/**
 * alert() の代替となる軽量な Snackbar 通知フック。
 *
 * @returns showMessage 通知を表示する関数 / snackbar 描画する要素
 */
export function useSnackbar() {
    const [state, setState] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "info",
    });

    const showMessage = useCallback((message: string, severity: Severity = "info") => {
        setState({ open: true, message, severity });
    }, []);

    const handleClose = useCallback(() => {
        setState((prev) => ({ ...prev, open: false }));
    }, []);

    const snackbar: React.ReactElement = (
        <Snackbar
            open={state.open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={handleClose} severity={state.severity} sx={{ width: "100%" }}>
                {state.message}
            </Alert>
        </Snackbar>
    );

    return { showMessage, snackbar };
}
