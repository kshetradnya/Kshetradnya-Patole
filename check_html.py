import re

def check_html(filepath):
    content = open(filepath, 'r', encoding='utf-8').read()
    
    # Check comments
    opens = [m.start() for m in re.finditer('<!--', content)]
    closes = [m.start() for m in re.finditer('-->', content)]
    print(f"Comments: Open {len(opens)}, Close {len(closes)}")
    
    # Simple tag balance check for common tags
    for tag in ['div', 'section', 'span', 'li', 'ul', 'nav', 'header', 'footer']:
        o = len(re.findall(f'<{tag}\\b', content, re.IGNORECASE))
        c = len(re.findall(f'</{tag}>', content, re.IGNORECASE))
        if o != c:
            print(f"Tag {tag}: Open {o}, Close {c}")

if __name__ == "__main__":
    check_html('c:/Users/PC/portfolio/Kshetradnya-Patole/Kshetra.html')
