# Content checklist and evidence notes

## Information still needed from Aditya

- [ ] Add the current resume PDF or a stable HTTPS link. `basics.resumeUrl` is intentionally absent.
- [x] Confirm the permanent production domain: `https://adityarallapalli.com/`. This is the canonical origin used by Astro configuration, page metadata, sitemap, and robots.txt.
- [ ] Confirm current GPA values, degree dates, internship dates, and preferred availability wording before publication. Existing education and dates were retained.
- [ ] Supply links for the previously listed LlamaIndex, LangChain, and ChromaDB contributions. The public merged-PR search during this review returned a GoDFS contribution, which is linked. Unverified specific merged claims are omitted, not treated as disproved.
- [ ] Confirm team size and personal ownership for each project. Do not imply sole authorship where it has not been established.
- [ ] Provide stable public demo URLs or short walkthrough recordings. Localhost, setup instructions, and paid phone services are not public demos.
- [ ] Provide evaluation artifacts for the internship’s previously listed 90.78% pixel accuracy and 92.8% classification accuracy, including split, dataset, and metric definition. The public copy omits these numbers pending context.
- [ ] Confirm the relationship between the 2024 internship and the segmentation repository’s older screenshot dates. Segmentation remains described as project work without a new date claim.

## Featured projects and evidence reviewed

Reviewed on 2026-09-05 UTC. Results below are source-reported, not newly executed benchmarks. Project records link directly to these artifacts.

| Project | Evidence | Editorial decision |
| --- | --- | --- |
| lsmdb | README cluster/durability sections; `internal/raft/node_test.go` | Show local single-client throughput/failover with hardware and workload. Include the four-client slowdown and distinguish embedded durability from Raft. |
| ShopSphere | README; ExperimentIQ and ModelGuard `reports/analysis_results.json` | Explicitly fictional company and synthetic data. Model AUC 0.7398 vs. recency 0.5650; conversion relative lift 0.0688, p=0.036. Revenue p=0.373 is not significant. |
| vLLM harness | README; `reports/README.md` | Report AWQ 2187.9 output tok/s at concurrency 32 on RTX A5000. Explain the serial baseline and memory tradeoff. Raw runs are git-ignored; report tables are available. |
| Mini Feature Store | README; `internal/historical/point_in_time.go` | Explain explicit timestamp and TTL checks. Do not turn the Spark materialization timing into a claim about historical joins or online serving. |
| PEFT comparison | README; `results/metrics/baseline_summary.json` | Zero-shot 0.7559 outperforms all adapters; IA3 0.6975. One seed and shared hyperparameters limit generalization. |
| RAG RBAC | README; `EVAL_RESULTS.md` | Show both 25-question faithfulness 0.9116 and 50-question 0.7423 with different judges. Do not conflate automated test count with evaluation questions. |

The directory’s additional project summaries are grounded in their public READMEs. Diffuse Refactor is described as a limited benchmark study, without its original claim of general proof. Graph Analytics is described as an educational ETL/graph project, without asserting real-time streaming or Kafka usage.

## Strongest next additions

1. A resume aligned with the site and linked evidence for open-source contributions.
2. Short, accessible demo recordings for the database failover, inference dashboard, and AI applications.
3. Clear ownership, dates, and reproducibility instructions for each featured project.
4. Additional experimental repetitions and confidence intervals where applicable. Keep existing negative results and limitations visible.
5. Real deployment or user-impact evidence, when available. Do not relabel simulations as production outcomes.
