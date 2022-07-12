import React from 'react'
import {render, screen, act, waitFor} from '@testing-library/react'
import {server} from './mocks/server'
import {rest} from 'msw'
import {DelayedForm} from './DelayedForm'

describe('DelayedForm', () => {

    afterEach(() => {
        jest.useRealTimers()
    })

    it('does not work with faketimers', async () => {
        jest.useFakeTimers();
        server.use(rest.get('/delay', (req, res, ctx) => {
            console.log("returning for msw");
            return res(ctx.delay(10), ctx.body('amazing'))
        }))
        setTimeout(() => {
            console.log("setTimeout in test")
        }, 10);
        act(() => {
            render(<DelayedForm/>)
        });

        console.log("before advanceTimersByTime 8");
        act(() => {
            jest.advanceTimersByTime(8)
        });
        console.log("after advanceTimersByTime 8");
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        console.log("before advanceTimersByTime 1");
        act(() => {
            jest.advanceTimersByTime(1)
        });
        console.log("after advanceTimersByTime 1");

        expect(screen.getByTestId("loading")).toBeInTheDocument();
        console.log("before advanceTimersByTime 10");
        act(() => {
            jest.advanceTimersByTime(10)
        });
        console.log("after advanceTimersByTime 10");
        expect(screen.getByText('amazing')).toBeInTheDocument();
        act(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });
    })

    it('this test works', async () => {
        server.use(rest.get('/delay', (req, res, ctx) => {
            return res(ctx.delay(10), ctx.body('amazing'))
        }))
        render(<DelayedForm/>)
        await waitFor(() => {
            expect(screen.getByText('amazing')).toBeInTheDocument();
        });
    })


    const Delayed = () => {
        const [state, setState] = React.useState("");
        setTimeout(() => {
            setState("halleluja");
        }, 10);

        if (state === "") {
            return <div>loading...</div>
        }

        return <div>{state}</div>
    }

    it("works", () => {
        jest.useFakeTimers();

        render(<Delayed/>);
        expect(screen.getByText("loading...")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(10)
        });
        expect(screen.getByText("halleluja")).toBeInTheDocument();
        jest.useRealTimers();
    });
})
