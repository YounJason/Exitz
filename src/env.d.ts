/// <reference types="astro/client" />

interface KVNamespace {}

interface Env {
  VIEWS: KVNamespace;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: Env;
    };
  }
}