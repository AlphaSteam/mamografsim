#!/usr/bin/env python3
import sys


def hola(x="falló argumento"):
    return f"Desde python: Hola {x}"


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("faltan argumentos")
    
    else:
        print(hola(sys.argv[1]))