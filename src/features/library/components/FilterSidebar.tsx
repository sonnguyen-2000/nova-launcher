import type { LibraryFilters, SourceFacet } from "../../../types/library";

interface FilterSidebarProps {
  sources: SourceFacet[];
  genres: string[];
  filters: LibraryFilters;
  hasFilters: boolean;
  onToggleSource: (key: string) => void;
  onToggleGenre: (genre: string) => void;
  onToggleFavorites: () => void;
  onToggleHidden: () => void;
  onClear: () => void;
}

export function FilterSidebar({
  sources,
  genres,
  filters,
  hasFilters,
  onToggleSource,
  onToggleGenre,
  onToggleFavorites,
  onToggleHidden,
  onClear,
}: FilterSidebarProps) {
  return (
    <aside className="filters">
      <section>
        <div className="section-title">Nguồn</div>
        <div className="facet-list">
          {sources.map((source) => (
            <button
              key={source.key}
              className={`facet${filters.sources.includes(source.key) ? " is-active" : ""}`}
              onClick={() => onToggleSource(source.key)}
            >
              <i className="dot" style={{ width: 10, height: 10, background: source.color }} />
              <span className="facet__label">{source.label}</span>
              <span className="facet__count">{source.count}</span>
            </button>
          ))}
        </div>
      </section>

      {genres.length > 0 && (
        <section>
          <div className="section-title">Thể loại</div>
          <div className="chips">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`chip${filters.genres.includes(genre) ? " is-active" : ""}`}
                onClick={() => onToggleGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="section-title">Trạng thái</div>
        <div className="facet-list">
          <button className={`facet${filters.onlyFavorites ? " is-active" : ""}`} onClick={onToggleFavorites}>
            <span className="facet__box" />
            <span className="facet__label">Chỉ yêu thích</span>
          </button>
          <button className={`facet${filters.showHidden ? " is-active" : ""}`} onClick={onToggleHidden}>
            <span className="facet__box" />
            <span className="facet__label">Hiện game đã ẩn</span>
          </button>
        </div>
      </section>

      {hasFilters && (
        <button className="btn" style={{ color: "var(--accent)" }} onClick={onClear}>
          Xoá tất cả bộ lọc
        </button>
      )}
    </aside>
  );
}