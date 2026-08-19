document.addEventListener("DOMContentLoaded", () => {
  const categoryList = document.getElementById("category-list");
  const weaponList = document.getElementById("weapon-list");
  const weaponCount = document.getElementById("weapon-count");

  const tabs = document.querySelectorAll(".weapon-tab");
  const panels = document.querySelectorAll(".weapon-panel");

  let weapons = [];

  /*
    =========================
       Tab
    =========================
    */

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // タブの状態
      tabs.forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      // パネルの状態
      panels.forEach((panel) => {
        panel.classList.remove("active");
      });

      const targetPanel = document.querySelector(`.weapon-panel[data-panel="${target}"]`);

      if (targetPanel) {
        targetPanel.classList.add("active");
      }

      // メイン以外では武器一覧を非表示
      if (target !== "main") {
        if (weaponCount) {
          weaponCount.textContent = "0 Items";
        }
      } else {
        // メインに戻ったら一覧を再表示
        renderWeapons("all");
      }
    });
  });

  /*
    =========================
       武器一覧を表示
    =========================
    */

  function renderWeapons(category = "all") {
    if (!weaponList) {
      return;
    }

    weaponList.innerHTML = "";

    const filteredWeapons = category === "all" ? weapons : weapons.filter((weapon) => weapon.category === category);

    if (weaponCount) {
      weaponCount.textContent = `${filteredWeapons.length} Weapons`;
    }

    if (filteredWeapons.length === 0) {
      weaponList.innerHTML = `
        <p class="error-message">
          該当するブキがありません。
        </p>
      `;

      return;
    }

    filteredWeapons.forEach((weapon) => {
      const card = document.createElement("a");

      card.href = `#${weapon.id}`;
      card.className = "weapon-card";

      card.innerHTML = `
        <div class="weapon-info">

          <h3>
            ${weapon.name}
          </h3>

          <span class="weapon-type">
            ${weapon.name_en}
          </span>

        </div>
      `;

      weaponList.appendChild(card);
    });
  }

  /*
    =========================
       カテゴリ一覧
    =========================
    */

  fetch("../json/weapon_categories.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("カテゴリJSONの読み込みに失敗しました");
      }

      return response.json();
    })

    .then((categories) => {
      categories.forEach((category, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "category-button";

        if (index === 0) {
          button.classList.add("active");
        }

        button.dataset.category = category.id;

        button.textContent = category.name;

        /*
          =========================
             カテゴリクリック
          =========================
          */

        button.addEventListener("click", () => {
          document.querySelectorAll(".category-button").forEach((item) => {
            item.classList.remove("active");
          });

          button.classList.add("active");

          renderWeapons(category.id);
        });

        categoryList.appendChild(button);
      });
    })

    .catch((error) => {
      console.error(error);

      categoryList.innerHTML = `
        <p class="error-message">
          カテゴリの読み込みに失敗しました。
        </p>
      `;
    });

  /*
    =========================
       武器JSON
    =========================
    */

  fetch("../json/weapon_main.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("武器JSONの読み込みに失敗しました");
      }

      return response.json();
    })

    .then((data) => {
      weapons = data;

      renderWeapons("all");
    })

    .catch((error) => {
      console.error(error);

      if (weaponList) {
        weaponList.innerHTML = `
          <p class="error-message">
            武器データの読み込みに失敗しました。
          </p>
        `;
      }
    });
});
