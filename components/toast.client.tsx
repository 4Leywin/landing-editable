"use client";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
const notify = () => toast("Here is your toast.");
const ToastClient = () => {
    return (
        <>
            <Toaster />
        </>
    );
};

export default ToastClient;
