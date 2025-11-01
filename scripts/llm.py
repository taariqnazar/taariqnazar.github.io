from llama_cpp import Llama
import json


def main():
    llm = Llama.from_pretrained(
        repo_id="TheBloke/Mistral-7B-Instruct-v0.1-GGUF",
        filename="mistral-7b-instruct-v0.1.Q2_K.gguf",
        n_ctx=2048,
        verbose=False,
    )

    bibtex = """
    @article{smith2025ai,
      title={The Future of AI},
      author={Smith, John},
      journal={AI Journal},
      volume={42},
      number={3},
      pages={123--145},
      year={2025},
      publisher={OpenAI Press}
    }
    """

    prompt = f"""
    Convert the following BibTeX entry into a valid JSON object with keys: type, id, title, author, journal, volume, number, pages, year, publisher.

    Do not include a trailing comma. Return only the JSON.

    BibTeX:
    \"\"\"
    {bibtex}
    \"\"\"

    JSON:
    """
    print(prompt)
    return

    response = llm(prompt, max_tokens=256)
    raw = response["choices"][0]["text"].strip()
    try:
        # crude fix if model misses trailing brace
        result = json.loads(raw)
        print("✅ Parsed JSON:")
        print(json.dumps(result, indent=2))
    except json.JSONDecodeError:
        print("⚠️ Failed to parse JSON. Raw output was:")
        print(raw)


if __name__ == "__main__":
    main()
