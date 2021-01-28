import React from "react";
import {render} from "react-dom";
import {useEffect, useState} from "react";
import {interval, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Button, Grid} from "@material-ui/core";

type Status = "run" | "stop" | "wait";

export default function App() {
    const [sec, setSec] = useState(0);
    const [status, setStatus] = useState<Status>("stop");

    useEffect(() => {
        const unsubscribe$ = new Subject();
        interval(1000)
            .pipe(takeUntil(unsubscribe$))
            .subscribe(() => {
                if (status === "run") {
                    setSec(val => val + 1000);
                }
            });
        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        };
    }, [status]);

    const start = React.useCallback(() => {
        setStatus("run");
    }, []);

    const stop = React.useCallback(() => {
        setStatus("stop");
        setSec(0);
    }, []);

    const reset = React.useCallback(() => {
        setSec(0);
    }, []);

    const waitCallback = React.useCallback(() => {
        debugger
        setStatus("wait");
    }, []);

    let clicks: Array<number> = [];
    let timeout: number;

    function wait(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        clicks.push(new Date().getTime());
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            if (clicks.length > 1 && clicks[clicks.length - 1] - clicks[clicks.length - 2] < 250) {
                waitCallback();
            }
        }, 300);
    }

    return (
        <Grid container
              direction="column"
              justify="center"
              alignItems="center">
            <Grid item>
            <span style={{'fontSize': '40px'}}>
                {new Date(sec).toISOString().slice(11, 19)}
            </span>
            </Grid>
            <Grid item>
                <Button
                    onClick={start}
                    disabled={status === "run"}
                    variant={"contained"}
                    size={'small'}>start</Button>
                <Button
                    onClick={stop}
                    disabled={status === "stop"}
                    variant={"contained"}
                    size={'small'}>stop</Button>
                <Button
                    onClick={reset}
                    disabled={status === 'stop'}
                    variant={"contained"}
                    size={'small'}>reset</Button>
                <Button
                    onClick={wait}
                    disabled={status === 'wait' || status === 'stop'}
                    variant={"contained"}
                    size={'small'}>wait</Button>
            </Grid>
        </Grid>)
}

render(<App/>, document.getElementById("root"));