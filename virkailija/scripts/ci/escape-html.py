import sys

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    ">": "&gt;",
    "<": "&lt;",
}

def escape_html(text):
    return "".join(html_escape_table.get(c, c) for c in text)

if __name__ == "__main__":
    sys.stdout.write(escape_html(sys.stdin.read()))
