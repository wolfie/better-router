"use client";
import { useStringParam, useStringUnionParam } from "betterouter/app-router";

export default function Home() {
  const [str, setStr] = useStringParam("str");
  const [union, setUnion] = useStringUnionParam("union", ["foo", "bar"], "bar");

  return (
    <div>
      <h1>App Router</h1>
      <div>{str}</div>
      <button onClick={() => setStr("foo")}>x</button>
      <div>{union}</div>
      <button onClick={() => setUnion(union === "foo" ? "bar" : "foo")}>
        x
      </button>
      <button
        onClick={() => {
          setStr("duplicate");
          setUnion(union === "foo" ? "bar" : "foo");
        }}
      >
        xx
      </button>
    </div>
  );
}
