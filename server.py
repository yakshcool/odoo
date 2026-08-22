import http.server
import socketserver
import os
import sys

PORTS = [8888, 8000, 5000, 3000, 9000]
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    for port in PORTS:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"GlobeTrotter server running at http://localhost:{port}")
                sys.stdout.flush()
                httpd.serve_forever()
                break
        except Exception as e:
            print(f"Port {port} unavailable, trying next port...")
            sys.stdout.flush()
