const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetStr = `           >
              Est. &mdash; Professional
           </motion.div>
        </div>
      </section>

      {/* Selected Works Gallery */}`;

const replacementStr = `           >
              Est. &mdash; Professional
           </motion.div>
        </div>
        </div>
      </section>

      {/* Selected Works Gallery */}`;

if (home.includes(targetStr)) {
  home = home.replace(targetStr, replacementStr);
  fs.writeFileSync('src/pages/Home.tsx', home);
  console.log('Closure patched successfully');
} else {
  console.log('Target string not found');
}
