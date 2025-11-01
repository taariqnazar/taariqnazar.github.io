import arxiv
from scholarly import scholarly

SCHOLAR_ID = "3eZbj84AAAAJ"
ARXIV_AUTHOR = "Taariq Nazar"


def fetch_google_scholar(scholar_id):
    author = scholarly.search_author_id(scholar_id)
    scholarly.fill(author, sections=["publications"])
    return [scholarly.fill(pub) for pub in author["publications"]]


def fetch_arxiv(author_name):
    client = arxiv.Client()
    search = arxiv.Search(query=f'au:"{author_name}"', max_results=100)
    results = client.results(search)
    return list(results)


def main():
    google_scholar_papers = fetch_google_scholar(SCHOLAR_ID)

    print("\nGoogle Scholar Publications:")
    for pub in google_scholar_papers:
        print(pub["bib"])

if __name__ == "__main__":
    main()
